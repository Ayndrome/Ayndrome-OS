const net = require('net');
const FileSharingProtocol = require('./file-sharing-protocol');

const HOST = '192.168.170.222';
const PORT = 3000;
const FILE_PATH = './public/vision2.zip';

const client = net.createConnection(PORT, HOST, async () => {
    console.log('✅ Connected to server!');

    await new Promise((resolve, reject) => {
        try {
            FileSharingProtocol.sendFile(client, FILE_PATH);
            resolve(); // Mark as successful
        } catch (err) {
            reject(err); // Catch any error
        }
    });

    console.log('✅ File Transferred Successfully');
});
