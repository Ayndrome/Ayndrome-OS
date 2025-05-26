const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    updateProgress: (progress) => ipcRenderer.send('progress-update', progress)
});

ipcRenderer.on('progress-update', (event, progress) => {
    ipcRenderer.send('progress-update', progress);
});
