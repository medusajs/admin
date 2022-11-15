import { Router } from "@reach/router"
import React from "react"
import TypeDetails from "./details"

const Types = () => {
  return (
    <Router className="h-full">
      <TypeDetails path=":id" />
    </Router>
  )
}

export default Types
