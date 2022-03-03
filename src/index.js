const { app, BrowserWindow, Menu, dialog } = require("electron");
const path = require("path");
const { ElectronBlocker } = require("@cliqz/adblocker-electron");
const { fetch } = require("cross-fetch");

let i = 0;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

async function startBlocking(session) {
  global.blocker = await ElectronBlocker.fromLists(fetch, [
    "https://easylist.to/easylist/easylist.txt",
    "https://easylist.to/easylist/easyprivacy.txt",
    // Does not import URLHaus as it breaks Google homepage
  ]);
  await global.blocker.enableBlockingInSession(session);
}

async function endBlocking(session) {
  await global.blocker.disableBlockingInSession(session);
}

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  mainWindow.setIcon(path.join(__dirname, "logo.png"));
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: "File",
        submenu: [
          {
            label: "New window",
            click: createWindow,
          },
          {
            label: "Open file",
            click: async () => {
              const file = await dialog.showOpenDialog(mainWindow, {
                properties: ["openFile"],
              });
              if (file.filePaths.length) {
                mainWindow.loadURL(
                  path.join(__dirname, "index.html") +
                    "?url=" +
                    encodeURIComponent(file.filePaths[0])
                );
              }
            },
          },
          {
            label: "Quit",
            click: app.quit,
          },
        ],
      },
      {
        label: "AdBlocker",
        submenu: [
          {
            label: "Disable",
            click() {
              endBlocking(mainWindow.webContents.session);
            },
          },
          {
            label: "Enable",
            click() {
              startBlocking(mainWindow.webContents.session);
            },
          },
        ],
      },
    ])
  );
  // and load the index.html of the app.
  let patha =
    process.argv.slice(2).length > 0 && i == 0
      ? path.join(__dirname, "index.html") +
        "?url=" +
        encodeURIComponent(process.argv[2])
      : path.join(__dirname, "index.html");
  process.argv.slice(2).length > 0 && i == 0
    ? mainWindow.loadURL(patha)
    : mainWindow.loadFile(patha);
  startBlocking(mainWindow.webContents.session);
  i += 1;
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
