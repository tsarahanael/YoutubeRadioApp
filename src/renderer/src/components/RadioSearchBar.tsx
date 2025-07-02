import React from 'react'
import { useState } from 'react'

type SearchBarProps = {
  onSearch: (query: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    const id = query.split('v=')[1]?.split('&')[0] || query
    onSearch(id)
    setQuery('')
  }

  return (
    <div className="bg-transparent flex justify-center items-center">
      <div className=" rounded-t-xl w-2/3 h-8 bg-cyan-800 flex flex-row items-center justify-evenly px-4 py-1">
        <form onSubmit={onSubmit}></form>
        <input
          type="text"
          className="rounded-full bg-cyan-100 h-lg w-3/4 text-xs px-2 text-gray-700 "
          placeholder="put your radio link here"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit(e)
            }
          }}
        />
        <input
          type="submit"
          className="bg-cyan-500 text-white px-2 py-1 rounded-full text-xs"
          onClick={onSubmit}
          value="Jam!"
        />
      </div>
    </div>
  )
}
export default SearchBar
