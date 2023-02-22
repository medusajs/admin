import React, { useMemo } from "react"
import Nestable from "react-nestable"

import "react-nestable/dist/styles/index.css"
import "../styles/product-categories.css"

import { ProductCategory } from "@medusajs/medusa"

import TriangleMiniIcon from "../../../components/fundamentals/icons/triangle-mini-icon"
import ProductCategoryListItemDetails from "./product-category-list-item-details"
import ReorderIcon from "../../../components/fundamentals/icons/reorder-icon"

type ProductCategoriesListProps = {
  categories: ProductCategory[]
}

/**
 * Draggable list that renders product categories tree view.
 */
function ProductCategoriesList(props: ProductCategoriesListProps) {
  const categories = useMemo(() => {
    /**
     * HACK - for now to properly reference nested children
     */
    const categoriesMap = {}
    props.categories.forEach((c) => (categoriesMap[c.id] = c))

    const visit = (active) => {
      const node = categoriesMap[active.id]

      node.category_children?.forEach((ch) =>
        Object.assign(ch, categoriesMap[ch.id])
      )

      return node
    }

    return props.categories
      .filter((c) => !c.parent_category_id)
      .map((c) => visit(c))
  }, [props.categories])

  return (
    <Nestable
      collapsed
      items={categories}
      childrenProp="category_children"
      renderItem={({ item, depth, handler, collapseIcon }) => (
        <ProductCategoryListItemDetails
          item={item}
          depth={depth}
          handler={handler}
          collapseIcon={collapseIcon}
        />
      )}
      handler={<ReorderIcon className="cursor-grab" color="#889096" />}
      renderCollapseIcon={({ isCollapsed }) => (
        <TriangleMiniIcon
          style={{
            top: -2,
            width: 32,
            left: -12,
            transform: !isCollapsed ? "" : "rotate(270deg)",
          }}
          color="#889096"
          size={18}
        />
      )}
    />
  )
}

export default ProductCategoriesList
