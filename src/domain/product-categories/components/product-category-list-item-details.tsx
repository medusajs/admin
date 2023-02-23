import React, { useContext } from "react"
import clsx from "clsx"

import { ProductCategory } from "@medusajs/medusa"
import { useAdminDeleteProductCategory } from "medusa-react"

import { ProductCategoriesContext } from "../pages"
import Tooltip from "../../../components/atoms/tooltip"
import Button from "../../../components/fundamentals/button"
import Actionables from "../../../components/molecules/actionables"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import FolderOpenIcon from "../../../components/fundamentals/icons/folder-open-icon"
import TagIcon from "../../../components/fundamentals/icons/tag-icon"
import MoreHorizontalIcon from "../../../components/fundamentals/icons/more-horizontal-icon"

type ProductCategoryListItemDetailsProps = {
  depth: number
  item: ProductCategory
  handler: React.ReactNode
  collapseIcon: React.ReactNode
}

function ProductCategoryListItemDetails(
  props: ProductCategoryListItemDetailsProps
) {
  const { item } = props

  const hasChildren = !!item.category_children?.length

  const productCategoriesPageContext = useContext(ProductCategoriesContext)

  const { mutateAsync: deleteCategory } = useAdminDeleteProductCategory(item.id)

  const actions = [
    {
      label: "Edit",
      onClick: () => productCategoriesPageContext.editCategory(item),
      icon: <EditIcon size={20} />,
    },
    {
      label: "Delete",
      variant: "danger",
      onClick: deleteCategory,
      icon: <TrashIcon size={20} />,
      disabled: !!item.category_children.length,
    },
  ]

  return (
    <div className="bg-white">
      <div
        style={{ marginLeft: props.depth * -8 }}
        className="flex items-center h-[40px]"
      >
        <div className="w-[32px] flex justify-center items-center">
          {props.handler}
        </div>

        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            {hasChildren && (
              <div className="w-[32px] flex justify-center items-center">
                {props.collapseIcon}
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
              {item.name}
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <Tooltip
              style={{ zIndex: 1 }}
              content={
                <>
                  Add category item to{" "}
                  <span className="font-semibold text-grey-80">
                    "{item.name}"
                  </span>
                </>
              }
            >
              <Button
                size="small"
                variant="ghost"
                onClick={() =>
                  productCategoriesPageContext.createSubCategory(item)
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
      </div>
    </div>
  )
}

export default ProductCategoryListItemDetails
