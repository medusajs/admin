import { Router } from "@reach/router"
import React from "react"
import Edit from "./edit"
import Overview from "./overview"

const ProductsRoute = () => {
  return (
    <Router>
      <Overview path="/" />
      <Edit path="/:id" />
    </Router>
  )
}

export default ProductsRoute
