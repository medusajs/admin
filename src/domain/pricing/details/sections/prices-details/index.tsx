import { Product } from "@medusajs/medusa"
import * as React from "react"
import Fade from "../../../../../components/atoms/fade-wrapper"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import UploadIcon from "../../../../../components/fundamentals/icons/upload-icon"
import BodyCard from "../../../../../components/organisms/body-card"
import UploadModal from "../../../../../components/organisms/upload-modal"
import useToggleState from "../../../../../hooks/use-toggle-state"
import EditPrices from "./edit-prices"
import EditPricesOverridesModal from "./edit-prices-overrides"
import PricesTable from "./prices-table"

const Prices = ({ id }) => {
  const { state: showEdit, open: openEdit, close: closeEdit } = useToggleState()
  const [showUpload, openUpload, closeUpload] = useToggleState()
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  )
  const actionables = [
    {
      label: "Edit manually",
      onClick: openEdit,
      icon: <EditIcon size={20} />,
    },
    // {
    //   label: "Import price list",
    //   onClick: openUpload,
    //   icon: <UploadIcon size={20} />,
    // },
  ]
  return (
    <BodyCard title="Prices" actionables={actionables} forceDropdown>
      <PricesTable id={id} selectProduct={setSelectedProduct} />
      <Fade isVisible={showEdit} isFullScreen={true}>
        <EditPrices close={closeEdit} id={id} />{" "}
      </Fade>
      {showUpload && (
        <UploadModal
          onClose={closeUpload}
          onUploadComplete={() => {}}
          fileTitle="price list"
          actionButtonText="Add Products Manually"
          description1Text="You can add to or 'update' a price list. A new import will update products with the same SKU. New products will be implemented as Drafts. Updated products will keep their current status."
          description2Title="Unsure about how to arrange your list?"
          description2Text="We have created a template file for you. Type in your own information and experience how much time and frustration this functionality can save you. Feel free to reach out if you have any questions."
        />
      )}
      {selectedProduct && (
        <EditPricesOverridesModal
          product={selectedProduct}
          close={() => setSelectedProduct(null)}
        />
      )}
    </BodyCard>
  )
}

export default Prices
