import React from "react"
import { Router } from "@reach/router"
import All from "./all"

const Orders = () => {
  return (
    <>
      <Router>
        <All path="all" />
      </Router>
    </>
  )
}

export default Orders
