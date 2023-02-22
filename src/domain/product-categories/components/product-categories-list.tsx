import { useMemo } from "react"
import Nestable from "react-nestable"

import "react-nestable/dist/styles/index.css"
import "../styles/product-categories.css"

import { ProductCategory } from "@medusajs/medusa"

import ReorderIcon from "../../../components/fundamentals/icons/reorder-icon"
import ProductCategoryListItemDetails from "./product-category-list-item-details"

export type DraggableListItem = {
  id: string
  category: ProductCategory
  children: DraggableListItem[]
}

type ProductCategoriesListItemProps = {
  isOpen: boolean
  item: DraggableListItem
  toggleCategory: () => void
}

function ProductCategoriesListItem(props: ProductCategoriesListItemProps) {
  const { item, isOpen, toggleCategory } = props

  return (
    <>
      <div className="bg-white">
        <div className="flex items-center h-[40px] gap-4">
          <ReorderIcon color="#889096" />
          <ProductCategoryListItemDetails
            item={item}
            isOpen={isOpen}
            toggleCategory={toggleCategory}
          />
        </div>
      </div>
    </>
  )
}

type ProductCategoriesListProps = {
  categories: ProductCategory[]
}

/**
 * Draggable list that renders product categories tree view.
 */
function ProductCategoriesList(props: ProductCategoriesListProps) {
  const flatCategoriesList = useMemo(() => {
    const categoriesMap = {}

    props.categories.forEach((c) => (categoriesMap[c.id] = c))

    const visit = (active) => {
      const node = categoriesMap[active.id]

      node.category_children?.forEach((ch) =>
        Object.assign(ch, categoriesMap[ch.id])
      )

      const children = node.category_children?.map((c) => visit(c))

      return { id: node.id, category: node, children }
    }

    return props.categories
      .filter((c) => !c.parent_category_id)
      .map((c) => visit(c))
  }, [props.categories])

  return (
    <Nestable
      items={flatCategoriesList}
      renderItem={ProductCategoriesListItem}
    />
  )
}

export default ProductCategoriesList
