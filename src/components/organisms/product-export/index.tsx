import { useAdminCreateBatchJob } from "medusa-react"
import React from "react"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"

type ProductExportModalProps = {
  handleClose: () => void
  onSubmit?: () => void
}

const ProductExport: React.FC<ProductExportModalProps> = ({
  handleClose,
  // onSubmit,
}) => {
  const notification = useNotification()
  const createBatchJob = useAdminCreateBatchJob()

  const submit = () => {
    const reqObj = {
      type: "product-export",
      context: {},
    }

    createBatchJob.mutate(reqObj, {
      onSuccess: () => {
        notification("Success", "Successfully initiated export", "success")
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
        handleClose()
      },
    })

    handleClose()
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Export Products</span>
        </Modal.Header>
        <Modal.Content>
          <div className="flex inter-small-semibold mb-2">Current filters</div>
          <div className="flex mb-4 inter-small-regular text-grey-50">
            You havn’t applied any filtering. Remember that the export list
            feature in many ways are controlled by how you filter the list
            overview.
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex justify-end">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              loading={createBatchJob.isLoading}
              variant="primary"
              size="small"
              onClick={submit}
            >
              Export
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ProductExport
