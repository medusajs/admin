import { PriceList } from "@medusajs/medusa"
import { useAdminUpdatePriceList } from "medusa-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"
import { nestedForm } from "../../../../../utils/nested-form"
import PriceListConfigurationForm from "../../../components/price-list-configuration-form"
import { PriceListConfigurationFormData } from "../../../types"

type Props = {
  open: boolean
  onClose: () => void
  priceList: PriceList
}

type Form = {
  configuration: PriceListConfigurationFormData
}

const PriceListConfigurationModal = ({ open, onClose, priceList }: Props) => {
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
    mutate(
      {
        ...data.configuration,
        customer_groups: data.configuration.customer_groups?.map((cg) => ({
          id: cg.value,
        })),
      },
      {
        onSuccess: () => {
          notification(
            "Price list updated",
            "Successfully updated the price list configuration",
            "success"
          )
          onClose()
        },
        onError: (err) => {
          notification(
            "Error updating price list",
            getErrorMessage(err),
            "error"
          )
        },
      }
    )
  })

  return (
    <Modal open={open} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold m-0">Edit Configurations</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <PriceListConfigurationForm
              form={nestedForm(form, "configuration")}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="w-full flex items-center justify-end gap-x-xsmall">
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
                Save and submit
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
    configuration: {
      includes_tax: priceList.includes_tax,
      customer_groups: priceList.customer_groups.map((cg) => ({
        value: cg.id,
        label: cg.name,
      })),
      ends_at: priceList.ends_at || undefined,
      starts_at: priceList.starts_at || undefined,
    },
  }
}

export default PriceListConfigurationModal
