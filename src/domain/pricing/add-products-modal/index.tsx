import { Product } from "@medusajs/medusa"
import { useAdminProducts } from "medusa-react"
import * as React from "react"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import { SelectableTable } from "../../../components/templates/selectable-table"
import useQueryFilters from "../../../hooks/use-query-filters"
import { columns, ProductHeader, ProductRow } from "./product-table-config"
import { refreshItems } from "./utils"

const defaultQueryProps = {
  limit: 12,
  offset: 0,
}

export type AddProductsModalProps = {
  close: () => void
  initialSelection: Product[]
  onSave: (items: Product[]) => void
}

const AddProductsModal = ({
  close,
  initialSelection,
  onSave,
}: AddProductsModalProps) => {
  const params = useQueryFilters(defaultQueryProps)
  const { products, isLoading, count = 0 } = useAdminProducts(
    params.queryObject,
    {
      keepPreviousData: true,
    }
  )
  const [ids, setIds] = React.useState(initialSelection.map((prod) => prod.id))
  const [selectedItems, setSelectedItems] = React.useState(initialSelection)

  React.useEffect(() => {
    setSelectedItems(refreshItems(selectedItems, ids, products))
  }, [ids, products])

  const handleSave = () => {
    onSave(selectedItems)
    close()
  }

  return (
    <Modal open handleClose={close}>
      <Modal.Body>
        <Modal.Header handleClose={close}>
          <h2 className="inter-xlarge-semibold">Add Products</h2>
        </Modal.Header>
        <Modal.Content>
          <div className="w-full flex flex-col justify-between min-h-[300px] h-full ">
            <SelectableTable
              columns={columns}
              data={products || []}
              renderRow={ProductRow}
              renderHeaderGroup={ProductHeader}
              onChange={(ids) => setIds(ids)}
              selectedIds={ids}
              isLoading={isLoading}
              resourceName="products"
              totalCount={count}
              options={{
                enableSearch: true,
                searchPlaceholder: "Search by name or description...",
              }}
              {...params}
            />
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex justify-end gap-2">
            <Button
              variant="ghost"
              className="rounded-rounded h-8 w-[128px]"
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="rounded-rounded h-8 w-[128px]"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default AddProductsModal
