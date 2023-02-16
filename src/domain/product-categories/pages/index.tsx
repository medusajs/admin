import useToggleState from "../../../hooks/use-toggle-state"
import BodyCard from "../../../components/organisms/body-card"
import CreateProductCategory from "../modals/add-product-category"
import { useAdminProductCategories } from "../../../../../medusa/packages/medusa-react"
import ProductCategoriesList from "../components/product-categories-list"

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

/**
 * Product category index page container.
 */
function ProductCategoryPage() {
  const {
    state: isCreateModalVisible,
    open: showCreateModal,
    close: hideCreateModal,
  } = useToggleState()

  const { product_categories: categories, isLoading } =
    useAdminProductCategories({
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

  return (
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
          <CreateProductCategory closeModal={hideCreateModal} />
        )}
      </div>
    </div>
  )
}

export default ProductCategoryPage
