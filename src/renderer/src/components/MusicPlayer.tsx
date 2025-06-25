import React, { useState } from 'react'
import YouTube from 'react-youtube'
import SearchBar from './RadioSearchBar'

const MusicPlayer: React.FC = () => {
  const [radioUrl, setRadioUrl] = useState('jfKfPfyJRdk')
  const updatePlayer = (id: string): void => {
    setRadioUrl(id)
  }

  const opts = {
    playerVars: {
      autoplay: 1, // Auto-play the video on load
      controls: 0, // Hide controls
      loop: 1, // Loop the video
      rel: 0, // only recommend videos from the same channel
      showinfo: 0, // Hide video title and uploader
      iv_load_policy: 3 // Disable annotations
    }
  }

  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-center, align-center">
      <SearchBar onSearch={updatePlayer} />
      <div className=" p-3 flex justify-center items-center bg-cyan-800 rounded-xl">
        <YouTube videoId={radioUrl} opts={opts} className="youtubeContainer" />
      </div>
    </div>
  )
}

export default MusicPlayer
