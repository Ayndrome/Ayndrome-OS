const { ipcRenderer } = require('electron');

document.getElementById('start-server').addEventListener('click', () => {
    ipcRenderer.send('start-server');
});

document.getElementById('send-file').addEventListener('click', () => {
    const filePath = 'path-to-your-file'; // Change this as needed
    ipcRenderer.send('send-file', filePath);
});

ipcRenderer.on('file-progress', (event, progress) => {
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    progressBar.value = progress;
    progressText.innerText = `Progress: ${progress}%`;

    if (progress === 100) {
        alert('✅ File transfer completed!');
    }
});
