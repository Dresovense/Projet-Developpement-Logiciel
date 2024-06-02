const { app, BrowserWindow } = require('electron')

function createWindow () {
    const win = new BrowserWindow({
    webPreferences: {
    nodeIntegration: true
    }
    })
    win.maximize()

    //Uncomment if working with python directly
    /* var python = require('child_process').spawn('py', ['../backend/app.py']);
    python.stdout.on('data', function (data) {
        console.log(data.toString('utf8'));
        if(data.toString("utf-8").includes("Backend is starting, ...")){
            win.loadFile("../frontend/index.html")
        }
    });
    python.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`); // when error
    }); */

    //Uncomment if working with an exe file
    var execfile = require('child_process').execFile;
    let backend = execfile(
        "dist/app.exe",
        {
            windowsHide: true,
        },
        (err, stdout, stderr) => {
            if(err){
                console.log(err);
            }
            if(stdout){
                console.log(stdout);
            }
            if(stderr){
                console.log(stderr);
            }
        }
    )
    backend.stdout.on('data', (data) => {
        console.log(data.toString('utf8'));
        if (data.toString('utf-8').includes('Backend is starting, ...')) {
            win.loadFile('../frontend/index.html');
        }
    });
    backend.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    
    //Always leave uncommented
    win.loadFile('../frontend/loading.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        const { exec } = require('child_process');
        exec('taskkill /f /t /im app.exe', (err, stdout, stderr) => {
            if (err){
                console.log(err)
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`)
        });
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})