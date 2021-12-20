import React from "react"
import UserButton from "../atoms/user-button"
import BellNotiIcon from "../fundamentals/icons/bell-noti"
import SearchBar from "./search-bar"

const Topbar = () => {
  return (
    <div className="w-full min-h-topbar max-h-topbar pr-xlarge pl-base bg-grey-0 border-b border-grey-20 sticky top-0 flex items-center justify-between">
      <SearchBar />
      <div className="flex items-center">
        <BellNotiIcon />
        <div className="ml-large">
          <UserButton />
        </div>
      </div>
    </div>
  )
}

export default Topbar
