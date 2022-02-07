import { Router } from "@reach/router"
import { navigate } from "gatsby"
import React from "react"
import { useHotkeys } from "react-hotkeys-hook"
import PrivateRoute from "../components/private-route"
import SEO from "../components/seo"
import Layout from "../components/templates/layout"
import Collections from "../domain/collections"
import Customers from "../domain/customers"
import Discounts from "../domain/discounts"
import GiftCards from "../domain/gift-cards"
import Oauth from "../domain/oauth"
import Orders from "../domain/orders"
import DraftOrders from "../domain/orders/draft-orders"
import Returns from "../domain/orders/returns"
import Swaps from "../domain/orders/swaps"
import Products from "../domain/products"
import Settings from "../domain/settings"

const IndexPage = () => {
  useHotkeys("g + o", () => navigate("/a/orders"))
  useHotkeys("g + p", () => navigate("/a/products"))
  return (
    <Layout>
      <SEO title="Medusa" />
      <Router basepath="a" className="h-full">
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
