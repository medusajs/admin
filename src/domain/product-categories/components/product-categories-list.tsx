import React, { useMemo } from "react"
import Nestable from "react-nestable"
import { dropRight, get, flatMap } from "lodash"

import "react-nestable/dist/styles/index.css"
import "../styles/product-categories.css"

import { ProductCategory } from "@medusajs/medusa"
import { adminProductCategoryKeys, useMedusa } from "medusa-react"

import TriangleMiniIcon from "../../../components/fundamentals/icons/triangle-mini-icon"
import ProductCategoryListItemDetails from "./product-category-list-item-details"
import ReorderIcon from "../../../components/fundamentals/icons/reorder-icon"
import { useQueryClient } from "@tanstack/react-query"
import useNotification from "../../../hooks/use-notification"

type ProductCategoriesListProps = {
  categories: ProductCategory[]
}

/**
 * Draggable list that renders product categories tree view.
 */
function ProductCategoriesList(props: ProductCategoriesListProps) {
  const { client } = useMedusa()
  const queryClient = useQueryClient()
  const notification = useNotification()
  const { categories } = props

  const onItemDrop = async (params: {
    item: ProductCategory
    items: ProductCategory[]
    path: number[]
  }) => {
    let parentId = null
    const { dragItem, items, targetPath } = params
    const [position] = targetPath.slice(-1)

    if (targetPath.length > 1) {
      const path = dropRight(
        flatMap(targetPath.slice(0, -1), (item) => [item, "category_children"])
      )

      const newParent = get(items, path)
      parentId = newParent.id
    }

    try {
      await client.admin.productCategories.update(dragItem.id, {
        parent_category_id: parentId,
        position,
      })
      notification("Success", "New order saved", "success")
      await queryClient.invalidateQueries(adminProductCategoryKeys.lists())
    } catch (e) {
      notification("Error", "Failed to save new order", "error")
    }
  }

  return (
    <Nestable
      collapsed
      items={categories}
      onChange={onItemDrop}
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
