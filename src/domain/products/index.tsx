import { Router, useLocation } from "@reach/router"
import clsx from "clsx"
import { navigate } from "gatsby"
import React, { useEffect, useState } from "react"
import PageDescription from "../../components/atoms/page-description"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../components/organisms/body-card"
import AddCollectionModal from "../../components/templates/add-collection-modal"
import CollectionsTable from "../../components/templates/collections-table"
import ProductTable from "../../components/templates/product-table"
import Details from "./details"
import New from "./new"

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
            onClick: () => setShowNewCollection(!showNewCollection),
            icon: (
              <span className="text-grey-90">
                <PlusIcon size={20} />
              </span>
            ),
          },
        ]
    }
  }

  const [showNewCollection, setShowNewCollection] = useState(false)

  const CustomHeader = () => {
    return (
      <div className="flex inter-large-semibold gap-x-base text-grey-40">
        <div
          onClick={() => setView("products")}
          className={clsx("cursor-pointer", {
            "text-grey-90": view === "products",
          })}
        >
          Products
        </div>
        <div
          onClick={() => setView("collections")}
          className={clsx("cursor-pointer", {
            "text-grey-90": view === "collections",
          })}
        >
          Collections
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <PageDescription
          title="Products"
          subtitle="Manage the products for your Medusa Store"
        />
        <div className="w-full flex flex-col grow">
          <BodyCard
            actionables={CurrentAction()}
            customHeader={<CustomHeader />}
          >
            <CurrentView />
          </BodyCard>
        </div>
      </div>
      {showNewCollection && (
        <AddCollectionModal
          onClose={() => setShowNewCollection(!showNewCollection)}
          onSubmit={console.log}
        />
      )}
    </>
  )
}

const Products = () => {
  return (
    <Router>
      <ProductIndex path="/" />
      <Details path=":id" />
      <New path="new" />
    </Router>
  )
}

export default Products
