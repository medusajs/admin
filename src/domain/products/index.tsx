import { Router, useLocation } from "@reach/router"
import { navigate } from "gatsby"
import React, { useEffect, useState } from "react"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import CollectionsTable from "../../components/templates/collections-table"
import ProductTable from "../../components/templates/product-table"
import EditProductPage from "./edit"
import NewProductPage from "./new"

const VIEWS = ["products", "collections"]

const ProductIndex = () => {
  const location = useLocation()
  const [view, setView] = useState("products")

  useEffect(() => {
    if (location.search.includes("?view=collections")) {
      setView("collections")
    }
  }, [location])

  useEffect(() => {
    location.search = ""
  }, [view])

  const CurrentView = () => {
    switch (view) {
      case "products":
        return <ProductTable />
      default:
        return <CollectionsTable />
    }
  }

  const CurrentAction = () => {
    switch (view) {
      case "products":
        return [
          {
            label: "New Product",
            onClick: () => navigate("/a/products/new"),
            icon: (
              <span className="text-grey-90">
                <PlusIcon size={20} />
              </span>
            ),
          },
        ]
      default:
        return [
          {
            label: "New Collection",
            onClick: () => navigate(`/a/collections/new`),
            icon: (
              <span className="text-grey-90">
                <PlusIcon size={20} />
              </span>
            ),
          },
        ]
    }
  }

  return (
    <>
      <div className="flex flex-col grow h-full">
        <div className="w-full flex flex-col grow">
          <BodyCard
            actionables={CurrentAction()}
            customHeader={
              <TableViewHeader
                views={VIEWS}
                setActiveView={setView}
                activeView={view}
              />
            }
          >
            <CurrentView />
          </BodyCard>
        </div>
      </div>
    </>
  )
}

const Products = () => {
  return (
    <Router>
      <ProductIndex path="/" />
      <EditProductPage path=":id" />
      <NewProductPage path="new" />
    </Router>
  )
}

export default Products
