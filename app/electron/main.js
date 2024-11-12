const { app, BrowserWindow,ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    // Crée la fenêtre principale
    const win = new BrowserWindow({
        minWidth: 1000,
        minHeight: 700,
        frame: false,
        icon: path.join(__dirname,"logo-previ.png"),
        webPreferences: {
          preload: path.join(__dirname, 'preload.js'),  // Assurez-vous que le chemin est correct
          nodeIntegration: false,
          contextIsolation: true,  // Important pour utiliser `contextBridge`
        }
    });
    ipcMain.on('window-control', (event, action) => {
      switch (action) {
        case 'minimize':
          win.minimize();
          break;
        case 'maximize':
          if (win.isMaximized()) {
            win.unmaximize();
          } else {
            win.maximize();
          }
          break;
        case 'close':
          win.close();
          break;
        default:
          break;
      }
    });

    // Charge l'application React en fonction du mode
    if (app.isPackaged) {
        // En production, charge le fichier `index.html` généré dans le dossier `build`
        win.loadFile(path.join(__dirname, 'build', 'index.html'));
    } else {
        // En développement, charge le serveur React
        win.loadURL('http://localhost:3000');
        win.webContents.openDevTools(); // Ouvre DevTools pour déboguer
    }
}

app.whenReady().then(createWindow);

// Quitte l'application quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
