import React from "react"
import { Router } from "@reach/router"
import { navigate } from "gatsby"
import { useHotkeys } from "react-hotkeys-hook"

import Oauth from "../domain/oauth"
import GiftCards from "../domain/gift-cards"
import Products from "../domain/products"
import Orders from "../domain/orders"
import Discounts from "../domain/discounts"
import Settings from "../domain/settings"
import Layout from "../components/layout"
import PrivateRoute from "../components/private-route"
import SEO from "../components/seo"
import Customers from "../domain/customers"

const IndexPage = () => {
  useHotkeys("g + o", () => navigate("/a/orders"))
  useHotkeys("g + p", () => navigate("/a/products"))
  return (
    <Layout>
      <SEO title="Home" />
      <Router basepath="a">
        <PrivateRoute path="oauth/:app_name" component={Oauth} />
        <PrivateRoute path="products/*" component={Products} />
        <PrivateRoute path="gift-cards/*" component={GiftCards} />
        <PrivateRoute path="orders/*" component={Orders} />
        <PrivateRoute path="discounts/*" component={Discounts} />
        <PrivateRoute path="customers/*" component={Customers} />
        <PrivateRoute path="settings/*" component={Settings} />
      </Router>
    </Layout>
  )
}

export default IndexPage
