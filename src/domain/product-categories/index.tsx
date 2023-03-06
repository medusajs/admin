import BodyCard from "../../components/organisms/body-card"
import { Route, Routes } from "react-router-dom"

const ProductCategoryIndex = () => {
  const actions = [
    {
      label: "Add category",
      onClick: () => {},
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
          setBorders={true}
          footerMinHeight={40}
        >
          <div className="flex items-center justify-center min-h-[600px]">
            <p className="text-grey-40">
              No product categories yet, use the above button to create your
              first category.
            </p>
          </div>
        </BodyCard>
      </div>
    </div>
  )
}

const ProductCategories = () => {
  return (
    <Routes>
      <Route index element={<ProductCategoryIndex />} />
    </Routes>
  )
}

export default ProductCategories
