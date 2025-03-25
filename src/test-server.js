const net = require('net');
const FileSharingProtocol = require('./file-sharing-protocol');

const PORT = 3000;
const SAVE_PATH = __dirname;

const server = net.createServer((socket) => {
    console.log('✅ Client connected!');
    FileSharingProtocol.receiveFile(socket, SAVE_PATH);
});

server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
