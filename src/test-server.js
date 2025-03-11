const net = require('net');
const fs = require('fs');
const path = require('path');
const ProgressBar = require('progress');

const DELAY_MS = 100; // Delay in milliseconds for slower transfer

const server = net.createServer((socket) => {
    console.log('📡 Client connected');

    let fileInfo = '';
    let fileStream;
    let receivedBytes = 0;
    let progressBar;
    let totalFileSize = 0;
    let successLogged = false;  
    let isStreamClosed = false; // ✅ Corrected Scope

    socket.on('data', (chunk) => {
        if (!fileStream) {
            fileInfo += chunk.toString();
            if (fileInfo.includes('\n')) {
                const { fileName, fileSize } = JSON.parse(fileInfo.trim());
                const filePath = path.join(__dirname, fileName);
                totalFileSize = parseInt(fileSize);

                fileStream = fs.createWriteStream(filePath);
                progressBar = new ProgressBar('⬇️ Downloading [:bar] :percent :etas', {
                    total: totalFileSize,
                    width: 40,
                });

                const remainingData = chunk.slice(fileInfo.indexOf('\n') + 1);
                writeWithDelay(fileStream, remainingData, () => isStreamClosed); // ✅ Pass as a callback

                receivedBytes += remainingData.length;
                progressBar.tick(receivedBytes);

                fileStream.on('close', () => {
                    isStreamClosed = true;  // ✅ Mark the stream as closed
                    if (!successLogged) {
                        console.log('✅ File received successfully!');
                        successLogged = true;
                    }
                });
            }
        } else {
            writeWithDelay(fileStream, chunk, () => isStreamClosed); // ✅ Pass as a callback
            receivedBytes += chunk.length;
            progressBar.tick(chunk.length);
        }
    });

    socket.on('end', () => {
        if (fileStream) fileStream.end();
    });

    socket.on('error', (err) => console.error(`❌ Error: ${err.message}`));
    socket.on('close', () => console.log('❌ Client disconnected'));
});

// Function to delay data writing
function writeWithDelay(stream, data, isStreamClosedCallback) {
    let index = 0;
    const chunkSize = 1024;

    function writeChunk() {
        if (index < data.length && !stream.closed) {
            const chunk = data.slice(index, index + chunkSize);
            if (!isStreamClosedCallback()) {
                stream.write(chunk);
            }
            index += chunkSize;
            setTimeout(writeChunk, DELAY_MS);
        }
    }

    writeChunk();
}

server.listen(3000, () => console.log('🚀 Server listening on port 3000'));
