const net = require('net');
const FileSharingProtocol = require('./file-sharing-protocol');

const HOST = '192.168.170.222';  
const PORT = 3000;
const FILE_PATH = './public/images.jpeg';  

const client = net.createConnection(PORT, HOST, () => {
    console.log('✅ Connected to server!');
    FileSharingProtocol.sendFile(client, FILE_PATH);
});
