const fs = require('fs');
const path = require('path');

class FileSharingProtocol {
    // Send file logic (PDF, JPEG, etc.)
    static sendFile(socket, filePath) {
        const fileName = path.basename(filePath);
        const fileSize = fs.statSync(filePath).size;

        socket.write(JSON.stringify({ fileName, fileSize }) + '\n');

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(socket, { end: false });

        fileStream.on('end', () => {
            console.log(`✅ File "${fileName}" sent successfully!`);
            socket.end(); // Close socket only after all data is sent
        });

        fileStream.on('error', (err) => {
            console.error(`❌ Error reading file: ${err.message}`);
        });
    }

    // Receive file logic (PDF, JPEG, etc.)
    static receiveFile(socket, savePath) {
        let fileInfo = '';
        let fileStream = null;
        let totalReceived = 0;
        let fileSize = 0; // Fixed: Defined globally for proper access

        socket.on('data', (chunk) => {
            if (!fileStream) {
                fileInfo += chunk.toString();

                if (fileInfo.includes('\n')) {
                    const headerEndIndex = fileInfo.indexOf('\n');
                    const fileHeader = fileInfo.slice(0, headerEndIndex).trim();
                    const parsedHeader = JSON.parse(fileHeader);

                    const { fileName } = parsedHeader;
                    fileSize = parsedHeader.fileSize;

                    const filePath = path.join(savePath, fileName);
                    fileStream = fs.createWriteStream(filePath);

                    const fileData = fileInfo.slice(headerEndIndex + 1);
                    if (fileData) {
                        fileStream.write(fileData);
                        totalReceived += Buffer.byteLength(fileData);
                    }
                }
            } else {
                if (!fileStream.writableEnded) {
                    fileStream.write(chunk);
                    totalReceived += chunk.length;
                }
            }

            if (fileStream && totalReceived >= parseInt(fileSize)) {
                if (!fileStream.writableEnded) {
                    fileStream.end();
                    console.log(`✅ File received successfully!`);
                }
            }
        });

        socket.on('error', (err) => {
            console.error(`❌ Error during file transfer: ${err.message}`);
        });

        socket.on('end', () => {
            if (fileStream && !fileStream.writableEnded) {
                fileStream.end();
                console.log(`✅ File transfer completed successfully!`);
            }
        });
    }
}

module.exports = FileSharingProtocol;
