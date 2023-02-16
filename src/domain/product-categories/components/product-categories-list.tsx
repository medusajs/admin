import { ProductCategory } from "@medusajs/medusa"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"
import { useRaisedShadow } from "../utils/use-raised-shadow"
import ReorderIcon from "../../../components/fundamentals/icons/reorder-icon"
import { useState } from "react"
import { useAdminProductCategories } from "../../../../../medusa/packages/medusa-react"

type ProductCategoriesListItemProps = {
  item: ProductCategory
  depth: number
}

function ProductCategoriesListItem(props: ProductCategoriesListItemProps) {
  const { depth, item } = props

  const [showChildren, setShowChildren] = useState(false)

  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()

  const { product_categories: childCategories } = useAdminProductCategories(
    { parent_category_id: item.id },
    { keepPreviousData: true, enabled: showChildren }
  )

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
          <span className="select-none font-medium text-xs">{item.name}</span>
        </div>
      </Reorder.Item>
      {childCategories?.length &&
        childCategories.map((c) => (
          <ProductCategoriesListItem depth={depth + 1} item={c} />
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

  return (
    <Reorder.Group axis="y" onReorder={setCategories} values={categories}>
      {categories.map((category) => (
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
