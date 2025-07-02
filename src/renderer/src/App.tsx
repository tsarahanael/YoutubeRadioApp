import React, { useState, useEffect } from 'react'
import TopBar from './components/TopBar'
import MusicPlayer from './components/MusicPlayer'
import { configService } from './services/config'

const App: React.FC = () => {
  const [isOverlay, setIsOverlay] = useState(false)
  const [lastVideoID, setLastVideoID] = useState<string | undefined>(undefined)

  useEffect(() => {
    window.electron.ipcRenderer.on('toggle-overlay', () => {
      setIsOverlay((prev) => !prev)
    })

    return () => {
      window.electron.ipcRenderer.removeAllListeners('toggle-overlay')
    }
  }, [])

  useEffect(() => {
    configService.loadConfig().then((config) => {
      console.log('Config loaded:', config)
      if (config?.lastVideoID) {
        setLastVideoID(config.lastVideoID)
      } else {
        setLastVideoID('jfKfPfyJRdk') // Default video ID
      }
    })
  }, [])

  const handleVideoChange = (videoId: string): void => {
    setLastVideoID(videoId)
    configService.saveConfig({ lastVideoID: videoId })
  }

  return lastVideoID ? (
    <>
      <div className={!isOverlay ? 'opacity-100' : 'opacity-40'}>
        <div className={!isOverlay ? 'visible' : 'invisible'}>
          <TopBar />
        </div>
        <MusicPlayer initialVideoId={lastVideoID} onVideoChange={handleVideoChange} />
      </div>
    </>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Loading Radio</h1>
    </div>
  )
}

export default App
