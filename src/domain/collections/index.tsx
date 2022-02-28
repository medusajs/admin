import { Router } from "@reach/router"
import React from "react"
import CollectionDetails from "./details"

const Collections = () => {
  return (
    <Router className="h-full">
      <CollectionDetails path=":id" />
    </Router>
  )
}

export default Collections
