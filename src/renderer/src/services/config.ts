export type AppConfig = {
  lastVideoID: string
}

export const configService = {
  loadConfig: async () => {
    return await window.configAPI.load()
  },
  saveConfig: async (data: AppConfig) => {
    await window.configAPI.save(data)
  }
}
