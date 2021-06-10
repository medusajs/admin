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
import Collections from "../domain/collections"
import Returns from "../domain/orders/returns"
import Swaps from "../domain/orders/swaps"
import DraftOrders from "../domain/orders/draft-orders"

const IndexPage = () => {
  useHotkeys("g + o", () => navigate("/a/orders"))
  useHotkeys("g + p", () => navigate("/a/products"))
  return (
    <Layout>
      <SEO title="Home" />
      <Router basepath="a">
        <PrivateRoute path="oauth/:app_name" component={Oauth} />
        <PrivateRoute path="products/*" component={Products} />
        <PrivateRoute path="collections/*" component={Collections} />
        <PrivateRoute path="gift-cards/*" component={GiftCards} />
        <PrivateRoute path="orders/*" component={Orders} />
        <PrivateRoute path="draft-orders/*" component={DraftOrders} />
        <PrivateRoute path="returns" component={Returns} />
        <PrivateRoute path="swaps" component={Swaps} />
        <PrivateRoute path="discounts/*" component={Discounts} />
        <PrivateRoute path="customers/*" component={Customers} />
        <PrivateRoute path="settings/*" component={Settings} />
      </Router>
    </Layout>
  )
}

export default IndexPage
