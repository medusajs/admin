import { Router } from "@reach/router"
import React from "react"
import CollectionDetails from "./details"
import NewCollectionDetails from "./new"

const Collections = () => {
  return (
    <Router className="h-full">
      <CollectionDetails path=":id" />
      <NewCollectionDetails path="new" />
    </Router>
  )
}

export default Collections
