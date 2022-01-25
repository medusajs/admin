import React, { useEffect, useContext } from "react"
import { navigate } from "gatsby"
import { InterfaceContext } from "../../context/interface"
import { Router } from "@reach/router"
import ProductTable from "../../components/templates/product-table"
import New from "./new"
import Details from "./details"
import useMedusa from "../../hooks/use-medusa"
import qs from "query-string"
import PageDescription from "../../components/atoms/page-description"
import BodyCard from "../../components/organisms/body-card"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"

const ProductIndex = () => {
  const filtersOnLoad = qs.parse(window.location.search)
  console.log("index filters", filtersOnLoad)
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

  const actionables = [
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

  return (
    <div className="flex flex-col h-full">
      <PageDescription
        title="Products"
        subtitle="Manage the products for your Medusa Store"
      />
      <div className="w-full flex flex-col grow">
        <BodyCard actionables={actionables}>
          <ProductTable />
        </BodyCard>
      </div>
    </div>
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
