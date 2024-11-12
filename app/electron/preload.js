// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  controlWindow: (action) => ipcRenderer.send('window-control', action),
});
