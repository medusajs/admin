import { useAdminProducts } from "medusa-react"
import React, { useState } from "react"
import { useDebounce } from "../../../hooks/use-debounce"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"
import CollectionProductTable from "../../templates/collection-product-table"

type AddProductModalProps = {
  handleClose: () => void
  onSubmit: () => void
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  handleClose,
  onSubmit,
}) => {
  const [query, setQuery] = useState("")
  const limit = 10
  const [offset, setOffset] = useState(0)

  const debouncedSearchTerm = useDebounce(query, 500)

  const { products, isLoading } = useAdminProducts({
    q: debouncedSearchTerm,
    offset: offset,
    limit: limit,
  })

  const handleSearch = (q) => {
    setOffset(0)
    setQuery(q)
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <h3 className="inter-xlarge-semibold">Add Products</h3>
        </Modal.Header>
        <Modal.Content>
          <div className="h-[650px]">
            <CollectionProductTable
              loadingProducts={isLoading}
              handleSearch={handleSearch}
              products={products}
            />
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
