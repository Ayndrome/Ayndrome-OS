const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const FileSharingProtocol = require('./file-sharing-protocol');
const net = require('net');

let win;

app.whenReady().then(() => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'renderer.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');

    ipcMain.on('start-server', () => {
        const server = net.createServer((socket) => {
            FileSharingProtocol.receiveFile(socket, path.join(__dirname, 'public'));
        });

        server.listen(3000, () => {
            console.log('🚀 Server listening on port 3000');
            win.webContents.send('server-status', 'Server is running on port 3000');
        });
    });

    ipcMain.on('send-file', (event, filePath) => {
        const client = net.createConnection(3000, '192.168.170.222', () => {
            console.log('✅ Connected to server!');
            FileSharingProtocol.sendFile(client, filePath);
        });
    });
});
