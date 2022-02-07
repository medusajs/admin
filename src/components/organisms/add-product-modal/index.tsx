import React from "react"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"
import AddProductsTable from "../../templates/collection-product-table/add-product-table"

type AddProductModalProps = {
  handleClose: () => void
  onSubmit: (selectedIds: string[], removedIds: string[]) => void
  collectionProducts: any[]
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  handleClose,
  onSubmit,
  collectionProducts,
}) => {
  const [selectedProducts, setSelectedProducts] = React.useState<any[]>([])

  const handleSelectProduct = async () => {
    if (selectedProducts.length > 0) {
      const allIds = collectionProducts.map((product) => product.id)

      const selectedIds = selectedProducts.map((product) => product.id)
      const removedIds = allIds.filter((id) => !selectedIds.includes(id))

      await onSubmit(selectedIds, removedIds)
    }
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <h3 className="inter-xlarge-semibold">Add Products</h3>
        </Modal.Header>
        <Modal.Content>
          <div className="h-[650px]">
            <AddProductsTable
              addedProducts={collectionProducts}
              setProducts={setSelectedProducts}
            />
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex items-center justify-end gap-x-xsmall w-full">
            <Button
              variant="ghost"
              size="small"
              className="w-eventButton"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              className="w-eventButton"
              onClick={async () => await handleSelectProduct()}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default AddProductModal
