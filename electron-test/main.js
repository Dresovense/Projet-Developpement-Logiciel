const { app, BrowserWindow } = require('electron')

function createWindow () {
    const win = new BrowserWindow({
    webPreferences: {
    nodeIntegration: true
    }
    })
    win.maximize()

    var python = require('child_process').spawn('py', ['../backend/app.py']);
    python.stdout.on('data', function (data) {
        console.log(data.toString('utf8'));
        if(data.toString("utf-8").includes("Backend is starting, ...")){
            win.loadFile("../frontend/index.html")
        }
    });
    python.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`); // when error
    });
    
    win.loadFile('../frontend/loading.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})