import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
    configAPI: {
      load: () => Promise<AppConfig>
      save: (data: AppConfig) => Promise<void>
    }
  }
}
