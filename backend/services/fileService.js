const { v4: uuidv4 } = require("uuid");
const File = require("../models/file");
const Chunk = require("../models/chunk");
const loadBalancer = require("./loadBalancer");

// Helper function to split the file into chunks
function splitFileIntoChunks(fileBuffer, chunkSize) {
  const chunks = [];
  for (let i = 0; i < fileBuffer.length; i += chunkSize) {
    chunks.push(fileBuffer.slice(i, i + chunkSize));
  }
  return chunks;
}

// Simulated function to distribute chunks to nodes
async function distributeChunkToNode(chunkData, fileId, sequence, nodeId) {
  const chunk = new Chunk({
    data: chunkData,
    sequence,
    fileId,
    nodeId,
  });
  await chunk.save();
  return chunk._id;
}

// Main function to upload file and distribute its chunks
async function uploadFile(fileData, userId, signal) {
  const { filename, mimeType, fileBuffer } = fileData;
  const chunkSize = 1024 * 1024; // 1MB chunks
  const fileChunks = splitFileIntoChunks(fileBuffer, chunkSize);

  // Create file metadata
  const fileId = uuidv4();
  const fileMetadata = new File({
    _id: fileId,
    filename,
    size: fileBuffer.length,
    mimeType,
    uploaded_by: userId,
  });

  const chunkPromises = [];
  let uploadedChunks = 0;

  for (let i = 0; i < fileChunks.length; i++) {
    const chunkData = fileChunks[i];

    // Check for cancellation
    if (signal && signal.aborted) {
      throw new Error("Upload canceled");
    }

    // Get the next node from the load balancer
    const node = loadBalancer.getNextNode();
    console.log(`Distributing chunk ${i} to node ${node.id}`);

    // Distribute chunk to the selected node
    chunkPromises.push(distributeChunkToNode(chunkData, fileId, i, node.id));

    // Get the next node for replication
    const replicaNode = loadBalancer.getNextNode();
    console.log(`Distributing replica of chunk ${i} to node ${replicaNode.id}`);

    // Distribute replica to the selected node
    chunkPromises.push(
      distributeChunkToNode(chunkData, fileId, i, replicaNode.id)
    );

    // Update progress (progress should be calculated and handled on the frontend)
    uploadedChunks += 2; // Each chunk has a primary and replica
    if (typeof setProgress === "function") {
      setProgress(Math.round((uploadedChunks / (fileChunks.length * 2)) * 100));
    }
  }

  const chunkIds = await Promise.all(chunkPromises);

  // Save file metadata with chunk references
  fileMetadata.chunks = chunkIds;
  await fileMetadata.save();

  return fileMetadata;
}

// Main function to download file from chunks and reconstruct it
async function downloadFile(fileId) {
  // Retrieve the file metadata
  const fileMetadata = await File.findById(fileId).populate("chunks");

  if (!fileMetadata) {
    throw new Error("File not found");
  }

  // Fetch all chunks for the file
  const chunks = await Chunk.find({ fileId }).sort("sequence");

  // Reassemble the file
  let fileBuffer = Buffer.concat(chunks.map((chunk) => chunk.data));

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
