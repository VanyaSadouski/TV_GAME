const electron = require('electron');
const url = require('url');
const path = require('path');

const {app , BrowserWindow} = electron;

let mainWindow;


app.on('ready', function () {
    mainWindow = new BrowserWindow({
        width: 1700,
        height: 1500,
        backgroundColor: '#312450',
        show: false
    });
    mainWindow.setMenu(null);
    mainWindow.setFullScreen(true);
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol:"file:",
        slashes:true
    }));
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    });

});