import { ClaimOrder, Fulfillment, Order, Swap } from "@medusajs/medusa"
import {
  useAdminCreateClaimShipment,
  useAdminCreateShipment,
  useAdminCreateSwapShipment,
} from "medusa-react"
import React, { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import Input from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import useToaster from "../../../../hooks/use-toaster"
import { getErrorMessage } from "../../../../utils/error-messages"

type MarkShippedModalProps = {
  orderId: string
  orderToShip: Order | Swap | ClaimOrder
  fulfillment: Fulfillment
  handleCancel: () => void
}

const MarkShippedModal: React.FC<MarkShippedModalProps> = ({
  orderId,
  orderToShip,
  fulfillment,
  handleCancel,
}) => {
  const { control, register, watch } = useForm({})

  const {
    fields,
    append: appendTracking,
    remove: removeTracking,
  } = useFieldArray({
    control,
    name: "tracking_numbers",
  })

  useEffect(() => {
    appendTracking({
      value: "",
    })
  }, [])

  const watchedFields = watch("tracking_numbers")

  // Allows us to listen to onChange events
  const trackingNumbers = fields.map((field, index) => ({
    ...field,
    ...watchedFields[index],
  }))

  const markOrderShipped = useAdminCreateShipment(orderId)
  const markSwapShipped = useAdminCreateSwapShipment(orderId)
  const markClaimShipped = useAdminCreateClaimShipment(orderId)

  const toaster = useToaster()

  const markShipped = () => {
    const [type] = orderToShip.id.split("_")

    const tracking_numbers = trackingNumbers.map(({ value }) => value)

    type actionType =
      | typeof markOrderShipped
      | typeof markSwapShipped
      | typeof markClaimShipped

    let action: actionType = markOrderShipped
    let successText = "Successfully marked order as shipped"
    let requestObj

    switch (type) {
      case "swap":
        action = markSwapShipped
        requestObj = {
          fulfillment_id: fulfillment.id,
          swap_id: orderToShip.id,
          tracking_numbers,
        }
        successText = "Successfully marked swap as shipped"
        break

      case "claim":
        action = markClaimShipped
        requestObj = {
          fulfillment_id: fulfillment.id,
          claim_id: orderToShip.id,
          tracking_numbers,
        }
        successText = "Successfully marked claim as shipped"
        break

      default:
        requestObj = {
          fulfillment_id: fulfillment.id,
          tracking_numbers,
        }
        break
    }

    action.mutate(requestObj, {
      onSuccess: () => {
        toaster(successText, "success")
        handleCancel()
      },
      onError: (err) => toaster(getErrorMessage(err), "error"),
    })
  }

  return (
    <Modal handleClose={handleCancel}>
      <Modal.Body>
        <Modal.Header handleClose={handleCancel}>
          <span className="inter-xlarge-semibold">
            Mark Fulfillment Shipped
          </span>
        </Modal.Header>
        <Modal.Content>
          <div className="flex flex-col">
            <span className="inter-base-semibold mb-2">Tracking</span>
            <div className="flex flex-col space-y-2">
              {trackingNumbers.map((tn, index) => (
                <Input
                  key={tn.id}
                  deletable={index !== 0}
                  label={index === 0 ? "Tracking number" : ""}
                  type="text"
                  placeholder={"Tracking number..."}
                  name={`tracking_numbers[${index}].value`}
                  // TODO: Should we have an invalid state for the input fields?
                  // invalid={
                  //   errors.tracking_numbers && errors.tracking_numbers[index]
                  // }
                  ref={register({
                    required: "Must be filled",
                  })}
                  onDelete={() => removeTracking(index)}
                />
              ))}
            </div>
          </div>
          <div className="flex w-full justify-end mt-4">
            <Button
              size="small"
              onClick={() => appendTracking({ key: "", value: "" })}
              variant="secondary"
              disabled={trackingNumbers.some((tn) => !tn.value)}
            >
              + Add Additional Tracking Number
            </Button>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full h-8 justify-end">
            <Button
              variant="ghost"
              className="mr-2 w-32 text-small justify-center"
              size="large"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              size="large"
              className="w-32 text-small justify-center"
              variant="primary"
              onClick={markShipped}
            >
              Complete
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default MarkShippedModal
