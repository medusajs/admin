import React from "react"
import { Router } from "@reach/router"

import Products from "../domain/products"
import Orders from "../domain/orders"
import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Router basepath="a">
      <Products path="products/*" />
      <Orders path="orders/*" />
    </Router>
  </Layout>
)

export default IndexPage
