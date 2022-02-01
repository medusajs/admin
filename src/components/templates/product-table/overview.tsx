import clsx from "clsx"
import { Link } from "gatsby"
import * as React from "react"
import { getProductStatusVariant } from "../../../utils/product-status-variant"
import ListIcon from "../../fundamentals/icons/list-icon"
import TileIcon from "../../fundamentals/icons/tile-icon"
import StatusIndicator from "../../fundamentals/status-indicator"
import Actionables from "../../molecules/actionables"
import useProductActionables from "./use-product-actionables"

const ProductOverview = ({ products, toggleListView }) => {
  return (
    <>
      <div className="flex justify-end border-t border-b border-grey-20 py-2.5 pr-xlarge">
        <div className="inter-small-semibold text-grey-50 flex justify-self-end">
          <span
            onClick={toggleListView}
            className={clsx(
              "hover:bg-grey-5 cursor-pointer rounded p-0.5 text-grey-40"
            )}
          >
            <ListIcon size={20} />
          </span>
          <span
            className={clsx(
              "hover:bg-grey-5 cursor-pointer rounded p-0.5 text-grey-90"
            )}
          >
            <TileIcon size={20} />
          </span>
        </div>
      </div>
      <div className="grid grid-cols-6">
        {products.map((product) => (
          <ProductTile product={product} />
        ))}
      </div>
    </>
  )
}

const ProductTile = ({ product }) => {
  const actionsRef = React.useRef<HTMLDivElement>(null)
  const { getActionables } = useProductActionables(product)

  return (
    <div className="p-base group rounded-rounded hover:bg-grey-5 flex-col">
      <div className="relative">
        <div
          ref={actionsRef}
          className={clsx("rounded-base inline-block absolute top-2 right-2")}
        >
          <Actionables
            actions={getActionables(product)}
            triggerClass="hidden-actions group-hover:opacity-100 focus-within:opacity-100 opacity-0 bg-grey-0"
          />
        </div>
        <Link to={`${product.id}`}>
          <img
            className="min-h-[230px] block object-fill rounded-rounded"
            src={product.thumbnail}
          />
          <div>
            <div className="mt-base flex items-center justify-between">
              <p className="inter-small-regular text-grey-90 line-clamp-1 mr-3">
                {product.title}
              </p>
              <StatusIndicator
                variant={getProductStatusVariant(product.status)}
                className="shrink-0"
              />
            </div>
            <span className="inter-small-regular text-grey-50 line-clamp-1">
              {product.collection?.title}
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default ProductOverview
