import React from "react"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"
import CollectionProductTable from "../../templates/collection-product-table"

type AddProductModalProps = {
  handleClose: () => void
  onSubmit: () => void
  collectionProducts: any[]
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  handleClose,
  onSubmit,
  collectionProducts,
}) => {
  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <h3 className="inter-xlarge-semibold">Add Products</h3>
        </Modal.Header>
        <Modal.Content>
          <div className="h-[650px]">
            <CollectionProductTable addedProducts={collectionProducts} />
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex items-center justify-end gap-x-xsmall w-full">
            <Button variant="ghost" size="small" className="w-eventButton">
              Cancel
            </Button>
            <Button variant="primary" size="small" className="w-eventButton">
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default AddProductModal
