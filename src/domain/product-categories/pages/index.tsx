import BodyCard from "../../../components/organisms/body-card"
import useToggleState from "../../../hooks/use-toggle-state"
import CreateProductCategory from "../modals/add-product-category"

function ProductCategory() {
  const {
    state: isCreateModalVisible,
    open: showCreateModal,
    close: hideCreateModal,
  } = useToggleState()

  const actions = [
    {
      label: "Add category",
      onClick: showCreateModal,
    },
  ]

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
          <div className="flex items-center justify-center min-h-[600px]">
            <p className="text-grey-40">
              No product categories yet, use the above button to create your
              first category.
            </p>
          </div>
        </BodyCard>
        {isCreateModalVisible && (
          <CreateProductCategory closeModal={hideCreateModal} />
        )}
      </div>
    </div>
  )
}

export default ProductCategory
