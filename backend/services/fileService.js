const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const File = require("../models/file");
const Chunk = require("../models/chunk");
const loadBalancer = require("./loadBalancer");
const chunkSchema = require("../models/chunk").schema;
const connectionCache = {};

// Helper function to split the file into chunks
function splitFileIntoChunks(fileBuffer, chunkSize) {
  const chunks = [];
  for (let i = 0; i < fileBuffer.length; i += chunkSize) {
    chunks.push(fileBuffer.slice(i, i + chunkSize));
  }
  return chunks;
}

async function getConnection(connectionString) {
  if (!connectionCache[connectionString]) {
    connectionCache[connectionString] = mongoose.createConnection(
      connectionString,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 20,
      }
    );
    connectionCache[connectionString].on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
  }
  return connectionCache[connectionString];
}

async function distributeChunkToNode(
  chunkData,
  fileId,
  sequence,
  node,
  replicaNode = null
) {
  const connectionString = node.connectionString;

  try {
    const connection = await getConnection(connectionString);
    const Chunk = connection.model("chunks", chunkSchema);

    const chunk = new Chunk({
      data: chunkData,
      sequence,
      fileId,
      nodeId: node.id,
      replicaNodeId: replicaNode ? replicaNode.id : null, // Handle replicaNodeId
    });

    await chunk.save();
    console.log(chunk);
    return chunk._id;
  } catch (error) {
    console.error(`Failed to distribute chunk to node ${node.id}:`, error);
    throw error;
  }
}

async function uploadFile(fileData, userId, signal, setProgress) {
  const { filename, mimeType, fileBuffer } = fileData;
  const chunkSize = 1024 * 1024; // 1MB chunks
  const fileChunks = splitFileIntoChunks(fileBuffer, chunkSize);

  const fileId = uuidv4();
  const fileMetadata = new File({
    _id: fileId,
    filename,
    size: fileBuffer.length,
    mimeType,
    uploaded_by: userId,
  });

  let uploadedChunks = 0;
  const chunkDetails = [];

  try {
    for (let i = 0; i < fileChunks.length; i++) {
      const chunkData = fileChunks[i];

      if (signal && signal.aborted) {
        throw new Error("Upload canceled");
      }

      const node = loadBalancer.getNextNode();
      const chunkId = await distributeChunkToNode(chunkData, fileId, i, node);

      const replicaNode = loadBalancer.getNextNode();
      const replicaChunkId = await distributeChunkToNode(
        chunkData,
        fileId,
        i,
        replicaNode,
        node
      );

      chunkDetails.push({
        chunkId,
        nodeId: node.id,
        replicaNodeId: replicaNode.id,
      });

      uploadedChunks += 2;
      if (typeof setProgress === "function") {
        setProgress(
          Math.round((uploadedChunks / (fileChunks.length * 2)) * 100)
        );
      }
    }

    fileMetadata.chunks = chunkDetails;
    await fileMetadata.save();
    return fileMetadata;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// Main function to download file from chunks and reconstruct it
async function downloadFile(fileId) {
  // Retrieve the file metadata
  const fileMetadata = await File.findById(fileId);

  if (!fileMetadata) {
    throw new Error("File not found");
  }

  // Fetch all chunks for the file using fileMetadata
  const chunkDetails = fileMetadata.chunks;
  const nodeChunksMap = new Map();

  // Group chunks by nodeId for concurrent fetching
  chunkDetails.forEach((chunkDetail) => {
    const { nodeId, chunkId } = chunkDetail;
    if (!nodeChunksMap.has(nodeId)) {
      nodeChunksMap.set(nodeId, []);
    }
    nodeChunksMap.get(nodeId).push(chunkId);
  });

  // Fetch chunks from each node and reconstruct the file
  const chunkBuffers = await Promise.all(
    Array.from(nodeChunksMap.entries()).map(async ([nodeId, chunkIds]) => {
      const node = await loadBalancer.getNodeById(nodeId);

      // Establish a temporary connection
      const connection = await mongoose.createConnection(
        node.connectionString,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );

      // Create a Chunk model using the schema and the temporary connection
      const Chunk = connection.model("Chunk", chunkSchema);

      // Fetch the chunks from this node
      const retrievedChunks = await Promise.all(
        chunkIds.map(async (chunkId) => {
          const retrievedChunk = await Chunk.findById(chunkId);
          return retrievedChunk.data;
        })
      );

      // Disconnect after retrieving the chunks
      await connection.close();
      return retrievedChunks;
    })
  );

  // Flatten the array of chunk buffers
  const flattenedChunkBuffers = chunkBuffers.flat();

  // Concatenate all chunk buffers to form the complete file buffer
  const fileBuffer = Buffer.concat(flattenedChunkBuffers);

  return {
    filename: fileMetadata.filename,
    mimeType: fileMetadata.mimeType,
    fileBuffer,
  };
}

// Main function to delete file from chunks
async function deleteFile(fileId) {
  const file = await File.findByIdAndDelete(fileId);
  if (!file) {
    throw new Error("File not found");
  }

  // Remove chunks associated with the file
  await Chunk.deleteMany({ fileId });

  return { message: "File deleted successfully" };
}

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile,
};
