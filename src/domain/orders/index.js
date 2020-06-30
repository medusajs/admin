import React from "react"
import { Router } from "@reach/router"
import Details from "./details"
import All from "./all"

const Orders = () => {
  return (
    <Router>
      <All path="/" />
      <Details path=":id" />
    </Router>
  )
}

export default Orders
