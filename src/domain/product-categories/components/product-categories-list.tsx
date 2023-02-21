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

  /**
   * When reorder starts close dragged category.
   */
  const onDragStart = () => {
    if (isOpen) {
      toggleCategory()
    }
  }

  return (
    <>
      <Reorder.Item
        value={item}
        dragListener={false}
        id={item.category.id}
        style={{ boxShadow, y }}
        dragControls={dragControls}
        onDragStart={onDragStart}
        className="relative bg-white"
      >
        <div className="flex items-center h-[40px] gap-4">
          <ReorderIcon
            color="#889096"
            onPointerDown={(event) => dragControls.start(event)}
          />
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
    setItems(
      flatCategoriesList.filter(
        (c) =>
          c.category.parent_category_id in openCategories ||
          !c.category.parent_category_id
      )
    )
  }, [openCategories])

  const setItems = (newItems) => {
    // flatCategoriesList.sort((a, b) => newItems.indexOf(a) - newItems.indexOf(b))
    _setItems(newItems)
    // TODO: set new order of `items` to `flatCategoriesList`
  }

  /**
   * Toggle display of subcategories in the list
   */
  const toggleCategory = (categoryId: string) => {
    const temp = { ...openCategories }
    if (temp[categoryId]) {
      delete temp[categoryId]

      const visit = (node) => {
        delete temp[node.id]

        node.category_children?.forEach(visit)
      }
      const rootNode = flatCategoriesList.find(
        (c) => c.category.id === categoryId
      )!.category

      visit(rootNode)
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
