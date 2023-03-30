import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { useHotkeys } from "react-hotkeys-hook"
import { Route, Routes, useNavigate } from "react-router-dom"
import { WRITE_KEY } from "../components/constants/analytics"
import PrivateRoute from "../components/private-route"
import SEO from "../components/seo"
import Layout from "../components/templates/layout"
import AnalyticsProvider from "../context/analytics"
import Collections from "../domain/collections"
import Customers from "../domain/customers"
import Discounts from "../domain/discounts"
import GiftCards from "../domain/gift-cards"
import Inventory from "../domain/inventory"
import Oauth from "../domain/oauth"
import Orders from "../domain/orders"
import DraftOrders from "../domain/orders/draft-orders"
import Pricing from "../domain/pricing"
import ProductsRoute from "../domain/products"
import PublishableApiKeys from "../domain/publishable-api-keys"
import SalesChannels from "../domain/sales-channels"
import Settings from "../domain/settings"

const IndexPage = () => {
  const navigate = useNavigate()
  useHotkeys("g + o", () => navigate("/a/orders"))
  useHotkeys("g + p", () => navigate("/a/products"))

  return (
    <PrivateRoute>
      <DashboardRoutes />
    </PrivateRoute>
  )
}

const DashboardRoutes = () => {
  return (
    <AnalyticsProvider writeKey={WRITE_KEY}>
      <DndProvider backend={HTML5Backend}>
        <Layout>
          <SEO title="Medusa" />
          <Routes className="h-full">
            <Route path="oauth/:app_name" element={<Oauth />} />
            <Route path="products/*" element={<ProductsRoute />} />
            <Route path="collections/*" element={<Collections />} />
            <Route path="gift-cards/*" element={<GiftCards />} />
            <Route path="orders/*" element={<Orders />} />
            <Route path="draft-orders/*" element={<DraftOrders />} />
            <Route path="discounts/*" element={<Discounts />} />
            <Route path="customers/*" element={<Customers />} />
            <Route path="pricing/*" element={<Pricing />} />
            <Route path="settings/*" element={<Settings />} />
            <Route path="sales-channels/*" element={<SalesChannels />} />
            <Route
              path="publishable-api-keys/*"
              element={<PublishableApiKeys />}
            />
            <Route path="inventory/*" element={<Inventory />} />
          </Routes>
        </Layout>
      </DndProvider>
    </AnalyticsProvider>
  )
}

export default IndexPage
