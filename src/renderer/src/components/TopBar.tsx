import React from 'react'

const TopBar: React.FC = () => {
  const handleMinimize = (): void => {
    console.log('Minimize button clicked')
    window.electron.ipcRenderer.send('minimize-window')
  }
  const handleClose = (): void => {
    console.log('Minimize button clicked')
    window.electron.ipcRenderer.send('close-window')
  }

  return (
    <div>
      <div
        className="rounded-t-xl bg-cyan-900 w-screen h-5"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties & { WebkitAppRegion?: string }}
      ></div>
      <div className="rounded-b-xl bg-cyan-900 w-screen h-2"></div>

      <div id="control-buttons" className=" text-stone-200 absolute top-0 right-0 pe-2">
        <button id="minimize-button" className="p-1" onClick={handleMinimize}>
          —
        </button>
        <button id="close-button" className="p-1" onClick={handleClose}>
          X
        </button>
      </div>
    </div>
  )
}

export default TopBar
