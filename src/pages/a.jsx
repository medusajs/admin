import { Router } from "@reach/router"
import { navigate } from "gatsby"
import React from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
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
import Pricing from "../domain/pricing"
import ProductsRoute from "../domain/products"
import SalesChannels from "../domain/sales-channels"
import Settings from "../domain/settings"

const IndexPage = () => {
  useHotkeys("g + o", () => navigate("/a/orders"))
  useHotkeys("g + p", () => navigate("/a/products"))

  return <PrivateRoute component={Routes} />
}

const Routes = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Layout>
        <SEO title="Medusa" />
        <Router basepath="a" className="h-full">
          <Oauth path="oauth/:app_name"/>
          <ProductsRoute path="products/*"/>
          <Collections path="collections/*"/>
          <GiftCards path="gift-cards/*" />
          <Orders path="orders/*" />
          <DraftOrders path="draft-orders/*" />
          <Discounts path="discounts/*"/>
          <Customers path="customers/*"/>
          <Pricing path="pricing/*"/>
          <Settings path="settings/*"/>
          <SalesChannels path="sales-channels/*" />
        </Router>
      </Layout>
    </DndProvider>
  )
}

export default IndexPage
