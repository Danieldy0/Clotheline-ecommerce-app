import React, { useState } from 'react'
import { Input } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

function Search({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1">
      <Input
        name="search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
        className="bg-gray-400 rounded-full px-3 py-1.5 text-sm w-full"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-gray-400 px-3 py-2 text-white hover:bg-gray-700"
      >
        <MagnifyingGlassIcon className="h-5 w-5" />
      </button>
    </form>
  )
}

export default Search