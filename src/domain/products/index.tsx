import { Router } from "@reach/router"
import clsx from "clsx"
import { navigate } from "gatsby"
import qs from "query-string"
import React, { useContext, useEffect, useState } from "react"
import PageDescription from "../../components/atoms/page-description"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../components/organisms/body-card"
import AddCollectionModal from "../../components/templates/add-collection-modal"
import ProductTable from "../../components/templates/product-table"
import { InterfaceContext } from "../../context/interface"
import useMedusa from "../../hooks/use-medusa"
import Details from "./details"
import New from "./new"

const ProductIndex = () => {
  const filtersOnLoad = qs.parse(window.location.search)

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 20
  }

  const defaultQueryProps = {
    fields: "id,title,thumbnail",
    expand: "variants,variants.prices,collection,tags",
  }
  const { refresh } = useMedusa("products", {
    search: {
      ...filtersOnLoad,
      ...defaultQueryProps,
    },
  })

  const searchQuery = (q) => {
    const baseUrl = qs.parseUrl(window.location.href).url

    const search = {
      q,
      offset: 0,
      limit: 20,
    }

    const prepared = qs.stringify(search, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.replaceState(baseUrl, "", `?${prepared}`)
    refresh({ search })
  }

  const { setOnSearch, onUnmount } = useContext(InterfaceContext)
  useEffect(onUnmount, [])
  useEffect(() => {
    setOnSearch(searchQuery)
  }, [])

  const [view, setView] = useState("products")

  const CurrentView = () => {
    switch (view) {
      case "products":
        return <ProductTable />
      default:
        return <div>collections</div>
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
    <Router className="h-full">
      <ProductIndex path="/" />
      <Details path=":id" />
      <New path="new" />
    </Router>
  )
}

export default Products
