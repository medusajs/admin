import React from "react"
import { Router } from "@reach/router"

import Details from "./pages/details"

const SalesChannels = () => {
  return <Router>{<Details path="/" />}</Router>
}

export default SalesChannels
