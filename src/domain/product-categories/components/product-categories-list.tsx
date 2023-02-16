import { useMemo, useState } from "react"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"

import { ProductCategory } from "@medusajs/medusa"

import { useRaisedShadow } from "../utils/use-raised-shadow"
import ReorderIcon from "../../../components/fundamentals/icons/reorder-icon"
import ProductCategoryListItemDetails from "./product-category-list-item-details"

type ProductCategoriesListItemProps = {
  item: ProductCategory
  depth: number
}

function ProductCategoriesListItem(props: ProductCategoriesListItemProps) {
  const { depth, item } = props

  const [showChildren, setShowChildren] = useState(true)

  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()

  return (
    <>
      <Reorder.Item
        id={item.id}
        value={item}
        style={{ boxShadow, y }}
        dragControls={dragControls}
        dragListener={false}
        className="relative bg-white"
      >
        <div className="flex items-center h-[40px] gap-4">
          <ReorderIcon onPointerDown={(event) => dragControls.start(event)} />
          <ProductCategoryListItemDetails category={item} depth={depth} />
        </div>
      </Reorder.Item>
      {!!item.category_children?.length &&
        item.category_children.map((c) => (
          <ProductCategoriesListItem key={c.id} depth={depth + 1} item={c} />
        ))}
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
  const [categories, setCategories] = useState(props.categories)
  const { flatCategoriesList, rootCategories } = useMemo(() => {
    const res = []
    const allCategories = {}

    categories.forEach((c) => (allCategories[c.id] = c))

    const topLevelCategories = categories.filter((c) => !c.parent_category_id)

    const go = (active) => {
      const node = allCategories[active.id]
      if (!node) {
        return
      }
      node.category_children?.forEach((ch) =>
        Object.assign(ch, allCategories[ch.id])
      )
      res.push(node)
      node.category_children?.forEach(go)
    }

    topLevelCategories.forEach(go)

    return { flatCategoriesList: res, rootCategories: topLevelCategories }
  }, [categories])

  return (
    <Reorder.Group
      axis="y"
      onReorder={setCategories}
      values={flatCategoriesList}
    >
      {rootCategories.map((category) => (
        <ProductCategoriesListItem
          key={category.id}
          item={category}
          depth={0}
        />
      ))}
    </Reorder.Group>
  )
}

export default ProductCategoriesList
