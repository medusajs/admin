import { createContext, useState } from "react"

import { ProductCategory } from "@medusajs/medusa"

import useToggleState from "../../../hooks/use-toggle-state"
import BodyCard from "../../../components/organisms/body-card"
import CreateProductCategory from "../modals/add-product-category"
import ProductCategoriesList from "../components/product-categories-list"
import { useAdminProductCategories } from "../../../../../medusa/packages/medusa-react"
import EditProductCategoriesSideModal from "../modals/edit-product-category"

/**
 * Product categories empty state placeholder.
 */
function ProductCategoriesEmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <p className="text-grey-40">
        No product categories yet, use the above button to create your first
        category.
      </p>
    </div>
  )
}

export const ProductCategoriesContext = createContext<{
  editCategory: (category: ProductCategory) => void
  createSubCategory: (category: ProductCategory) => void
}>({} as any)

/**
 * Product category index page container.
 */
function ProductCategoryPage() {
  const {
    state: isCreateModalVisible,
    open: showCreateModal,
    close: hideCreateModal,
  } = useToggleState()

  const {
    state: isEditModalVisible,
    open: showEditModal,
    close: hideEditModal,
  } = useToggleState()

  const [activeCategory, setActiveCategory] = useState<ProductCategory>()

  const { product_categories: categories, isLoading } =
    useAdminProductCategories({
      expand: "category_children",
      // TODO: doesn't work
      // parent_category_id: null,
    })

  const actions = [
    {
      label: "Add category",
      onClick: showCreateModal,
    },
  ]

  const showList = !isLoading && categories?.length

  const editCategory = (category: ProductCategory) => {
    setActiveCategory(category)
    showEditModal()
  }

  const createSubCategory = (category: ProductCategory) => {
    setActiveCategory(category)
    showCreateModal()
  }

  const context = {
    editCategory,
    createSubCategory,
  }

  return (
    <ProductCategoriesContext.Provider value={context}>
      <div className="flex flex-col grow h-full">
        <div className="w-full flex flex-col grow">
          <BodyCard
            className="h-full"
            title="Product Categories"
            subtitle="Helps you to keep your products organized."
            actionables={actions}
            footerMinHeight={40}
            setBorders
          >
            {showList ? (
              <ProductCategoriesList categories={categories!} />
            ) : (
              <ProductCategoriesEmptyState />
            )}
          </BodyCard>
          {isCreateModalVisible && (
            <CreateProductCategory
              parentCategory={activeCategory}
              closeModal={() => {
                hideCreateModal()
                setActiveCategory(undefined)
              }}
            />
          )}

          <EditProductCategoriesSideModal
            close={hideEditModal}
            activeCategory={activeCategory}
            isVisible={!!activeCategory && isEditModalVisible}
          />
        </div>
      </div>
    </ProductCategoriesContext.Provider>
  )
}

export default ProductCategoryPage
