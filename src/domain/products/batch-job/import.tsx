import React from "react"
import UploadModal from "../../../components/organisms/upload-modal"

type ImportProductsProps = {
  handleClose: () => void
  isModalOpen: boolean
}

function ImportProducts(props: ImportProductsProps) {
  const { isModalOpen, handleClose } = props

  if (!isModalOpen) {
    return null
  }

  return (
    <UploadModal
      onClose={handleClose}
      fileTitle={"products list"}
      actionButtonText="Import products"
      description2Title="Unsure about how to arrange your list?"
      description1Text="Through imports you can add or update products. To update existing products you must use the existing handle, to update existing variants you must use the existing SKU. You will be asked for confirmation before we import products."
      description2Text="Download the template below to ensure you are following the correct format."
    />
  )
}

export default ImportProducts
