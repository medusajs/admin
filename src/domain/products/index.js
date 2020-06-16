import React from "react"
import { Router } from "@reach/router"

import New from "./new"

const Products = () => {
  return (
    <>
      <Router>
        <New path="new" />
      </Router>
    </>
  )
}

export default Products
