import React from "react"
import { Router } from "@reach/router"

import Products from "../domain/products"
import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Router basepath="a">
      <Products path="products/*" />
    </Router>
  </Layout>
)

export default IndexPage
