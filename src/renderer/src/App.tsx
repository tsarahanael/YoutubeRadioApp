import React, { useState, useEffect } from 'react'
import TopBar from './components/TopBar'
import MusicPlayer from './components/MusicPlayer'

const App: React.FC = () => {
  const [isOverlay, setIsOverlay] = useState(false)
  useEffect(() => {
    window.electron.ipcRenderer.on('toggle-overlay', () => {
      setIsOverlay((prev) => !prev)
    })

    return () => {
      window.electron.ipcRenderer.removeAllListeners('toggle-overlay')
    }
  }, [])
  return (
    <>
      <div className={!isOverlay ? 'opacity-100' : 'opacity-40'}>
        <div className={!isOverlay ? 'visible' : 'invisible'}>
          <TopBar />
        </div>
        <MusicPlayer />
      </div>
    </>
  )
}

export default App
