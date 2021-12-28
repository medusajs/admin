import React from "react"
import Sidebar from "../organisms/sidebar"
import Topbar from "../organisms/topbar"

const Layout = ({ children }) => {
  return (
    <div className="flex w-full h-screen inter-base-regular">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <div className="large:px-xlarge bg-grey-5 min-h-content overflow-y-scroll">
          <main className="my-xlarge xsmall:mx-base small:mx-xlarge medium:mx-4xlarge large:mx-auto large:max-w-7xl large:w-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout
