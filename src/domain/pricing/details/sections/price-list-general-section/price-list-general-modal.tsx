import { PriceList } from "@medusajs/medusa"
import { useAdminUpdatePriceList } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"
import { nestedForm } from "../../../../../utils/nested-form"
import PriceListGeneralForm from "../../../components/price-list-general-form"
import { PriceListGeneralFormData } from "../../../types"

type Props = {
  priceList: PriceList
  open: boolean
  onClose: () => void
}

type Form = {
  general: PriceListGeneralFormData
}

const PriceListGeneralModal = ({ open, onClose, priceList }: Props) => {
  const form = useForm<Form>({
    defaultValues: transformData(priceList),
  })
  const {
    reset,
    handleSubmit,
    formState: { isDirty },
  } = form

  useEffect(() => {
    reset(transformData(priceList))
  }, [priceList, open, reset])

  const notification = useNotification()
  const { mutate, isLoading } = useAdminUpdatePriceList(priceList.id)

  const onSubmit = handleSubmit((data) => {
    mutate(data.general, {
      onSuccess: () => {
        notification(
          "Price list updated",
          "Successfully updated the price list general information",
          "success"
        )
        onClose()
      },
      onError: (err) => {
        notification("Error updating price list", getErrorMessage(err), "error")
      },
    })
  })

  return (
    <Modal handleClose={onClose} open={open}>
      <Modal.Body>
        <form onSubmit={onSubmit}>
          <Modal.Header handleClose={onClose}>
            <h1 className="inter-xlarge-semibold m-0">
              Edit General Information
            </h1>
          </Modal.Header>
          <Modal.Content>
            <PriceListGeneralForm form={nestedForm(form, "general")} />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full gap-x-xsmall">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                disabled={!isDirty || isLoading}
                loading={isLoading}
              >
                Save and close
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const transformData = (priceList: PriceList): Form => {
  return {
    general: { name: priceList.name, description: priceList.description },
  }
}

export default PriceListGeneralModal
