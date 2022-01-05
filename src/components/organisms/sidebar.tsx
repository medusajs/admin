import React from "react"
import OldSideBar from "../sidebar"

const Sidebar: React.FC = () => {
  return (
    <div className="min-w-sidebar max-w-sidebar h-full bg-gray-0 border-r border-grey-20 py-4xlarge px-base">
      <OldSideBar />
    </div>
  )
}

export default Sidebar
