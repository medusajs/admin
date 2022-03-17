import { Product } from "@medusajs/medusa"
import clsx from "clsx"
import React from "react"
import Button from "../../fundamentals/button"
import DollarSignIcon from "../../fundamentals/icons/dollar-sign-icon"
import MinusIcon from "../../fundamentals/icons/minus-icon"
import MoreHorizontalIcon from "../../fundamentals/icons/more-horizontal-icon"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import Actionables from "../../molecules/actionables"

type LeafProps = {
  id: string
  title: string
  sku?: string
  prices: {
    id: string
    currency_code: string
    amount: number
  }[]
}

type ProductVariantTreeProps = {
  product: Pick<Product, "title" | "id" | "thumbnail"> & {
    variants: LeafProps[]
  }
}

const ProductVariantTree: React.FC<ProductVariantTreeProps> = ({ product }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <div>
      <Container>
        <div className="flex items-center justify-between">
          <div className="gap-x-small flex items-center">
            <div>
              <img src={product.thumbnail} className="w-4 h-5 rounded-base" />
            </div>
            <span className="inter-small-semibold">{product.title}</span>
          </div>
          <div className="flex items-center gap-x-xsmall">
            <Actionables
              customTrigger={Trigger()}
              actions={[
                {
                  label: "Edit",
                  onClick: () => console.log("Edit prices"), // temp - should open edit prices overrides modal with "Apply on all variants" checked
                  icon: <DollarSignIcon />,
                },
                {
                  label: "Delete",
                  onClick: () => console.log("Remove prices for variant"), // temp - should delete all money amounts for variants from product in price list
                  icon: <TrashIcon />,
                  variant: "danger",
                },
              ]}
            />
            <div className="h-5 w-px rounded-circle bg-grey-20" />
            <Button
              variant="ghost"
              size="small"
              className="p-[6px] text-grey-50"
              onClick={() => setOpen(!open)}
            >
              {open ? <MinusIcon size={20} /> : <PlusIcon size={20} />}
            </Button>
          </div>
        </div>
      </Container>
      <div
        className={clsx("pl-5 mt-xsmall", {
          hidden: !open,
          "animate-fade-in-top": open,
        })}
      >
        {product.variants.map((variant) => {
          return ProductVariantLeaf(variant)
        })}
      </div>
    </div>
  )
}

const ProductVariantLeaf = ({ id, sku, title, prices = [] }: LeafProps) => {
  return (
    <div className="group flex items-center relative pb-xsmall last:pb-0">
      <div className="absolute top-0 left-0 bottom-0">
        <div className="border-l border-dashed border-grey-20 h-1/2 w-px" />
        <div className="h-1/2 border-l border-dashed border-grey-20 w-px group-last:border-none"></div>
      </div>
      <div className="w-[13px] h-px border-t border-grey-20 border-dashed mr-xsmall" />
      <Container className="w-full flex items-center justify-between inter-small-regular">
        <div>
          <span>{title}</span>
          {sku && <span className="text-grey-50 ml-xsmall">(SKU: {sku})</span>}
        </div>
        <div className="flex items-center text-grey-50">
          <div className="text-grey-50 mr-xsmall">
            {prices.length ? (
              <span>{`${prices.length} price${
                prices.length > 1 ? "s" : ""
              }`}</span>
            ) : (
              <span className="inter-small-semibold text-orange-40">
                Add prices
              </span>
            )}
          </div>
          <Actionables
            customTrigger={Trigger()}
            actions={[
              {
                label: "Edit",
                onClick: () => console.log(`Edit prices for ${id}`), // temp - should open edit prices overrides modal with only this variant selected
                icon: <DollarSignIcon />,
              },
              {
                label: "Delete",
                onClick: () => console.log(`Remove prices for ${id}`), // temp - should delete money amounts in PriceList for this variant
                icon: <TrashIcon />,
                variant: "danger",
              },
            ]}
          />
        </div>
      </Container>
    </div>
  )
}

const Container: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        "rounded-rounded border border-grey-20 py-2xsmall px-small",
        className
      )}
    >
      {children}
    </div>
  )
}

const Trigger = () => {
  return (
    <Button variant="ghost" size="small" className="p-[6px] text-grey-50">
      <MoreHorizontalIcon size={20} />
    </Button>
  )
}

export default ProductVariantTree
