import React, { useContext } from "react"
import clsx from "clsx"

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
import TagIcon from "../../../components/fundamentals/icons/tag-icon"
import MoreHorizontalIcon from "../../../components/fundamentals/icons/more-horizontal-icon"

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

  const paddingLeft = hasChildren ? depth * 32 : (depth - 1) * 32 + 64

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
      style={{ paddingLeft }}
      className="flex justify-between items-center w-full"
    >
      <div onClick={toggleCategory} className="flex items-center">
        {hasChildren && (
          <div className="w-[32px] flex justify-center items-center">
            <TriangleMiniIcon
              color="#889096"
              style={{ top: -2, transform: isOpen ? "" : "rotate(270deg)" }}
              size={18}
            />
          </div>
        )}
        <div className="w-[32px] flex justify-center items-center">
          {hasChildren && <FolderOpenIcon color="#889096" size={18} />}
          {!hasChildren && <TagIcon color="#889096" size={18} />}
        </div>
        <span
          className={clsx("select-none font-medium text-xs ml-2", {
            "text-gray-400 font-normal": !hasChildren,
          })}
        >
          {category.name}
        </span>
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
            <PlusIcon color="#687076" size={18} />
          </Button>
        </Tooltip>
        <Actionables
          forceDropdown
          actions={actions}
          customTrigger={
            <Button
              size="small"
              variant="ghost"
              className="w-xlarge h-xlarge focus-visible:outline-none focus-visible:shadow-input focus-visible:border-violet-60 focus:shadow-none"
            >
              <MoreHorizontalIcon color="#687076" size={20} />
            </Button>
          }
        />
      </div>
    </div>
  )
}

export default ProductCategoryListItemDetails
