const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    // Crée la fenêtre principale
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false // Permet `require` dans le code React
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