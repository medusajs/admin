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
  return (
    <DndProvider backend={HTML5Backend}>
      <Layout>
        <SEO title="Medusa" />
        <Router basepath="a" className="h-full">
          <PrivateRoute path="oauth/:app_name" component={Oauth} />
          <PrivateRoute path="products/*" component={ProductsRoute} />
          <PrivateRoute path="collections/*" component={Collections} />
          <PrivateRoute path="gift-cards/*" component={GiftCards} />
          <PrivateRoute path="orders/*" component={Orders} />
          <PrivateRoute path="draft-orders/*" component={DraftOrders} />
          <PrivateRoute path="discounts/*" component={Discounts} />
          <PrivateRoute path="customers/*" component={Customers} />
          <PrivateRoute path="pricing/*" component={Pricing} />
          <PrivateRoute path="settings/*" component={Settings} />
          <PrivateRoute path="sales-channels/*" component={SalesChannels} />
        </Router>
      </Layout>
    </DndProvider>
  )
}

export default IndexPage
