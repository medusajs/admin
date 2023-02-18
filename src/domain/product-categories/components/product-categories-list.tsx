import { useEffect, useMemo, useState } from "react"
import { Reorder, useDragControls, useMotionValue } from "framer-motion"

import { ProductCategory } from "@medusajs/medusa"

import { useRaisedShadow } from "../utils/use-raised-shadow"
import ReorderIcon from "../../../components/fundamentals/icons/reorder-icon"
import ProductCategoryListItemDetails from "./product-category-list-item-details"

type DraggableListItem = {
  depth: number
  category: ProductCategory
}

type ProductCategoriesListItemProps = {
  isOpen: boolean
  item: DraggableListItem
  toggleCategory: () => void
}

function ProductCategoriesListItem(props: ProductCategoriesListItemProps) {
  const { item, isOpen, toggleCategory } = props

  const y = useMotionValue(0)
  const boxShadow = useRaisedShadow(y)
  const dragControls = useDragControls()

  return (
    <>
      <Reorder.Item
        value={item}
        id={item.category.id}
        style={{ boxShadow, y }}
        dragControls={dragControls}
        dragListener={false}
        className="relative bg-white"
      >
        <div className="flex items-center h-[40px] gap-4">
          <ReorderIcon onPointerDown={(event) => dragControls.start(event)} />
          <ProductCategoryListItemDetails
            {...item}
            isOpen={isOpen}
            toggleCategory={toggleCategory}
          />
        </div>
      </Reorder.Item>
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
    const flatCategoriesList: DraggableListItem[] = []

    props.categories.forEach((c) => (categoriesMap[c.id] = c))

    const visit = (active, depth) => {
      const node = categoriesMap[active.id]

      node.category_children?.forEach((ch) =>
        Object.assign(ch, categoriesMap[ch.id])
      )

      flatCategoriesList.push({ depth, category: node })

      node.category_children?.forEach((c) => visit(c, depth + 1))
    }

    props.categories
      .filter((c) => !c.parent_category_id)
      .forEach((c) => visit(c, 0))

    return flatCategoriesList
  }, [props.categories])

  const [openCategories, setOpenCategories] = useState({})

  const [items, _setItems] = useState<DraggableListItem[]>(flatCategoriesList)

  useEffect(() => {
    setItems((ii) =>
      flatCategoriesList
        .sort(
          (a, b) =>
            ii.map((i) => i.category.id).indexOf(b) -
            ii.map((i) => i.category.id).indexOf(a)
        )
        .filter(
          (c) =>
            c.category.parent_category_id in openCategories ||
            !c.category.parent_category_id
        )
    )
  }, [flatCategoriesList, openCategories])

  const setItems = (newItems) => {
    // flatCategoriesList.sort((a, b) => newItems.indexOf(a) - newItems.indexOf(b))
    _setItems(newItems)
    // TODO: set new order of `ìtems` to `flatCategoriesList`
  }

  const toggleCategory = (categoryId: string) => {
    const temp = { ...openCategories }
    if (temp[categoryId]) {
      delete temp[categoryId]
    } else {
      temp[categoryId] = true
    }
    setOpenCategories(temp)
  }

  return (
    <Reorder.Group axis="y" onReorder={setItems} values={items}>
      {items.map((item) => (
        <ProductCategoriesListItem
          item={item}
          key={item.category.id}
          isOpen={openCategories[item.category.id]}
          toggleCategory={() => toggleCategory(item.category.id)}
        />
      ))}
    </Reorder.Group>
  )
}

export default ProductCategoriesList
