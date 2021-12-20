import React from "react"
import Sidebar from "../molecules/sidebar"
import Topbar from "../molecules/topbar"

const Layout = ({ children }) => {
  return (
    <div className="flex w-full h-screen inter-base-regular">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-scroll">
        <Topbar />
        <main className="p-xlarge">{children}</main>
      </div>
    </div>
  )
}

export default Layout
