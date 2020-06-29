import React from "react"
import { Router } from "@reach/router"

import Products from "../domain/products"
import Orders from "../domain/orders"
import Layout from "../components/layout"
import PrivateRoute from "../components/private-route"
import SEO from "../components/seo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Router basepath="a">
      <PrivateRoute path="products/*" component={Products} />
      <PrivateRoute path="orders/*" component={Orders} />
    </Router>
  </Layout>
)

export default IndexPage
