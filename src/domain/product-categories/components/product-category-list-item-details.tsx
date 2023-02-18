import React, { useContext } from "react"

import { ProductCategory } from "@medusajs/medusa"

import { ProductCategoriesContext } from "../pages"
import Tooltip from "../../../components/atoms/tooltip"
import Button from "../../../components/fundamentals/button"
import Actionables from "../../../components/molecules/actionables"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import { useAdminDeleteProductCategory } from "../../../../../medusa/packages/medusa-react"
import FolderOpenIcon from "../../../components/fundamentals/icons/folder-open-icon"
import TriangleMiniIcon from "../../../components/fundamentals/icons/triangle-mini-icon"

type ProductCategoryListItemDetailsProps = {
  depth: number
  isOpen: boolean
  category: ProductCategory
  toggleCategory: () => void
}

function ProductCategoryListItemDetails(
  props: ProductCategoryListItemDetailsProps
) {
  const { category, depth, isOpen, toggleCategory } = props

  const hasChildren = !!category.category_children?.length

  const productCategoriesPageContext = useContext(ProductCategoriesContext)

  const { mutateAsync: deleteCategory } = useAdminDeleteProductCategory(
    category.id
  )

  const actions = [
    {
      label: "Edit",
      onClick: () => productCategoriesPageContext.editCategory(category),
      icon: <EditIcon size={20} />,
    },
    {
      label: "Delete",
      variant: "danger",
      onClick: deleteCategory,
      icon: <TrashIcon size={20} />,
      disabled: !!category.category_children?.length,
    },
  ]

  return (
    <div
      style={{ paddingLeft: depth * 32 }}
      className="flex justify-between items-center w-full"
    >
      <div onClick={toggleCategory} className="flex gap-2 items-center">
        {hasChildren && (
          <TriangleMiniIcon
            style={{ top: -2, transform: isOpen ? "" : "rotate(270deg)" }}
            size={16}
          />
        )}
        {hasChildren && <FolderOpenIcon size={18} />}
        <span className="select-none font-medium text-xs">{category.name}</span>
      </div>

      <div className="flex gap-2 items-center">
        <Tooltip
          style={{ zIndex: 1 }}
          content={
            <>
              Add category item to{" "}
              <span className="font-semibold text-grey-80">
                "{category.name}"
              </span>
            </>
          }
        >
          <Button
            size="small"
            variant="ghost"
            onClick={() =>
              productCategoriesPageContext.createSubCategory(category)
            }
          >
            <PlusIcon size={18} />
          </Button>
        </Tooltip>
        <Actionables forceDropdown actions={actions} />
      </div>
    </div>
  )
}

export default ProductCategoryListItemDetails
