import { Router } from "@reach/router"
import { navigate } from "gatsby"
import React from "react"
import PageDescription from "../../components/atoms/page-description"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../components/organisms/body-card"
import ProductTable from "../../components/templates/product-table"
import Details from "./details"
import New from "./new"

const ProductIndex = () => {
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
    <Router>
      <ProductIndex path="/" />
      <Details path=":id" />
      <New path="new" />
    </Router>
  )
}

export default Products
