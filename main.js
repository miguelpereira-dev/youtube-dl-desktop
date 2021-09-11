const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const youtube = require('./music/index');

function createWindow() {
	const mainWindow = new BrowserWindow({
		height: 720,
		width: 1280,
		autoHideMenuBar: true,
		darkTheme: true,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			nodeIntegration: true,
			nativeWindowOpen: true,
		},
	});

	mainWindow.loadFile(path.join(__dirname, './app/index.html'));
}

app.on('ready', () => {
	createWindow();

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

ipcMain.on('download-musics', (e, dir, musics) => {
	e.preventDefault();
	musics.forEach((music) => {
		youtube(dir, music);
	});
});
