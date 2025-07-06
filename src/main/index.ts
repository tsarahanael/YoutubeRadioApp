import { app, shell, BrowserWindow, ipcMain, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 350,
    height: 300,
    autoHideMenuBar: true,
    skipTaskbar: true,
    transparent: true,
    frame: false,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.setAlwaysOnTop(true, 'modal-panel')

  setInterval(() => {
    mainWindow.setAlwaysOnTop(true, 'pop-up-menu')
  }, 1000)
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    console.log(app.getPath('userData'))
  })

  mainWindow.setAspectRatio(1)

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  const toggleOverlayHotKey = 'CommandOrControl+Shift+O'
  let isOverlay = false
  globalShortcut.register(toggleOverlayHotKey, () => {
    isOverlay = !isOverlay
    mainWindow.setIgnoreMouseEvents(isOverlay)

    mainWindow.webContents.send('toggle-overlay', isOverlay)
    console.log(`Overlay is now ${isOverlay ? 'enabled' : 'disabled'}`)
  })
}

const isSingleInstance = app.requestSingleInstanceLock()

if (!isSingleInstance) {
  console.log('Another instance is already running. Exiting this instance.')
  app.quit()
} else {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    // IPC test
    ipcMain.on('ping', () => console.log('pong'))

    ipcMain.on('close-window', () => {
      const currentWindow = BrowserWindow.getFocusedWindow()
      if (currentWindow) {
        currentWindow.close()
      }
    })

    ipcMain.on('minimize-window', () => {
      const currentWindow = BrowserWindow.getFocusedWindow()
      if (currentWindow) {
        currentWindow.minimize()
      }
    })

    const configPath = join(app.getPath('userData'), 'config.json')

    ipcMain.handle('config:load', async () => {
      console.log(`Loading config from ${configPath}`)
      if (!fs.existsSync(configPath)) {
        console.log('Config file does not exist, returning empty config.')
        return {}
      }
      const config = fs.readFileSync(configPath, 'utf-8')
      return JSON.parse(config)
    })

    ipcMain.handle('config:save', async (_e, data) => {
      console.log(`Saving config to ${configPath}`)
      fs.writeFileSync(configPath, JSON.stringify(data, null, 2))
    })

    createWindow()

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
}
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
