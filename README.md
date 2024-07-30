# Distributed File System (DFS) Project

![DFS Logo](path/to/logo.png)

## Introduction

The **Distributed File System (DFS)** project is designed to facilitate efficient and reliable file storage and retrieval across multiple storage servers. It supports concurrent uploads and downloads, ensuring high availability and quick access to files. With a robust fuzzy search system, users can find their files with ease, even with partial or approximate search terms.

## Features

- **Concurrent Uploads and Downloads**: Supports multiple file transfers simultaneously, enhancing user experience and efficiency.
- **Fuzzy Search System**: Allows users to find files quickly and easily, even with partial or inexact search queries.
- **Load Balancer**: Distributes data chunks across multiple storage servers for rapid access and high availability.
- **Server Health Monitoring**: Utilizes cron jobs to check the status of storage servers and redistribute data from failed nodes.
- **Personalized User Dashboard**: Displays dynamic system status and user activities, providing a comprehensive overview of the system's performance.

## Technology Stack

- **MongoDB Atlas**: A scalable and flexible NoSQL database for efficient data storage.
- **React.js**: A powerful front-end library for building user interfaces.
- **Node.js**: A JavaScript runtime for server-side programming.
- **Express.js**: A web application framework for Node.js to build robust APIs.

## Problem Solved

The DFS project addresses the following challenges:

- **Efficient File Management**: Provides a system for storing and retrieving files quickly and reliably across multiple servers.
- **High Availability**: Ensures that files are always accessible, even if some storage servers fail.
- **User-Friendly Search**: Implements a fuzzy search algorithm to help users find files easily, even with incomplete or approximate search terms.
- **Dynamic Monitoring**: Continuously monitors the health of storage servers and redistributes data as necessary to maintain system integrity.

## Installation

To get started with the DFS project, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/your-repo.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd your-repo
    ```

3. **Install dependencies**:
    ```bash
    npm install
    ```

4. **Set up environment variables**: Create a `.env` file in the root directory and add the required environment variables:
    ```env
    MONGODB_URI=your_mongodb_uri
    PORT=your_port_number
    ```

5. **Start the server**:
    ```bash
    npm start
    ```

## Usage

Once the server is running, you can access the DFS project via the following URL:

