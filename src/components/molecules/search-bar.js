import React from "react"
import OSShortcut from "../atoms/os-shortcut"
import SearchInput from "../atoms/search-input"
import SearchIcon from "../fundamentals/icons/search-icon"

const SearchBar = () => {
  return (
    <div className="flex items-center">
      <SearchIcon />
      <div className="mr-xsmall ml-base">
        <OSShortcut />
      </div>
      <SearchInput />
    </div>
  )
}

export default SearchBar
