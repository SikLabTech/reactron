const { app, BrowserWindow } = require('electron')
var path = require('path');
let mainWindow;

exports.execProcess = (process, callback) => {
  const { exec } = require('child_process');
  const callExec = exec(process)

  callExec.stdout.on('data', function (data) {
    callback(data)
  })
  callExec.stderr.on('data', function (data) {
    callback("<b>ERROR:</b> \n" + data)
  })
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,

    // Caracteristicas visuais da janela
    // autoHideMenuBar: true,
    // titleBarStyle: 'customButtonsOnHover',
    frame: true, // Retira barra superior
    useContentSize: false, // Inibe mostragem de dimensao da janela

    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(String(Object.assign(new URL(path.join(__dirname, 'index.html')), {
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  })));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
