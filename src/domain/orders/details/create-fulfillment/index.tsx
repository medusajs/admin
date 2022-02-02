import {
  AdminPostOrdersOrderClaimsClaimFulfillmentsReq,
  AdminPostOrdersOrderFulfillmentsReq,
  AdminPostOrdersOrderSwapsSwapFulfillmentsReq,
  ClaimOrder,
  Order,
  Swap,
} from "@medusajs/medusa"
import clsx from "clsx"
import {
  useAdminCreateFulfillment,
  useAdminFulfillClaim,
  useAdminFulfillSwap,
} from "medusa-react"
import React, { useState } from "react"
import Button from "../../../../components/fundamentals/button"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import MinusIcon from "../../../../components/fundamentals/icons/minus-icon"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import Modal from "../../../../components/molecules/modal"
import Table from "../../../../components/molecules/table"
import Metadata, {
  MetadataField,
} from "../../../../components/organisms/metadata"
import useToaster from "../../../../hooks/use-toaster"
import { getErrorMessage } from "../../../../utils/error-messages"

type CreateFulfillmentModalProps = {
  handleCancel: () => void
  address?: object
  email?: string
  orderToFulfill: Order | ClaimOrder | Swap
  orderId: string
}

const ItemsTable = ({
  items,
  toFulfill,
  setToFulfill,
  quantities,
  setQuantities,
}) => {
  const handleQuantity = (upOrDown, item) => {
    const current = quantities[item.id]

    let newQuantities = { ...quantities }

    if (upOrDown === -1) {
      newQuantities = {
        ...newQuantities,
        [item.id]: current - 1,
      }
    } else {
      newQuantities = {
        ...newQuantities,
        [item.id]: current + 1,
      }
    }

    setQuantities(newQuantities)
  }

  const handleFulfillmentItemToggle = (item) => {
    const id = item.id
    const idxOfToggled = toFulfill.indexOf(id)

    // if already in fulfillment items, you unchecked the item
    // so we remove the item
    if (idxOfToggled !== -1) {
      const newFulfills = [...toFulfill]
      newFulfills.splice(idxOfToggled, 1)
      setToFulfill(newFulfills)
    } else {
      const newFulfills = [...toFulfill, id]
      setToFulfill(newFulfills)

      const newQuantities = {
        ...quantities,
        [item.id]: item.quantity - item.fulfilled_quantity,
      }

      setQuantities(newQuantities)
    }
  }

  return (
    <Table>
      <Table.HeadRow className="text-grey-50 inter-small-semibold border-t border-t-grey-20">
        <Table.HeadCell>Details</Table.HeadCell>
        <Table.HeadCell />
        <Table.HeadCell className="text-right pr-8">Quantity</Table.HeadCell>
      </Table.HeadRow>
      <Table.Body>
        {items?.map((item) => {
          const checked = toFulfill.includes(item.id)
          return (
            <>
              <Table.Row className={"border-b-grey-0 hover:bg-grey-0"}>
                <Table.Cell className="w-[50px]">
                  <div className="items-center ml-1 h-full flex">
                    <div
                      onClick={() => handleFulfillmentItemToggle(item)}
                      className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border cursor-pointer rounded-base ${
                        checked && "bg-violet-60"
                      }`}
                    >
                      <span className="self-center">
                        {checked && <CheckIcon size={16} />}
                      </span>
                    </div>

                    <input
                      className="hidden"
                      checked={checked}
                      tabIndex={-1}
                      onChange={() => handleFulfillmentItemToggle(item)}
                      type="checkbox"
                    />
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="min-w-[240px] flex py-2">
                    <div className="w-[30px] h-[40px] ">
                      <img
                        className="h-full w-full object-cover rounded"
                        src={item.thumbnail}
                      />
                    </div>
                    <div className="inter-small-regular text-grey-50 flex flex-col ml-4">
                      <span>
                        <span className="text-grey-90">{item.title}</span>
                      </span>
                      <span>{item?.variant?.title || ""}</span>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="text-right w-32 pr-8">
                  {toFulfill.includes(item.id) ? (
                    <div className="flex w-full text-right justify-end text-grey-50 ">
                      <span
                        onClick={() => handleQuantity(-1, item)}
                        className={clsx(
                          "w-5 h-5 flex text-grey-50 items-center justify-center rounded cursor-pointer hover:bg-grey-20 mr-2",
                          {
                            ["pointer-events-none text-grey-30"]:
                              quantities[item.id] === 1,
                          }
                        )}
                      >
                        <MinusIcon size={16} />
                      </span>
                      <span>{quantities[item.id] || ""}</span>
                      <span
                        onClick={() => handleQuantity(1, item)}
                        className={clsx(
                          "w-5 h-5 flex text-grey-50 items-center justify-center rounded cursor-pointer hover:bg-grey-20 ml-2",
                          {
                            ["pointer-events-none text-grey-30"]:
                              item.quantity - item.fulfilled_quantity ===
                              quantities[item.id],
                          }
                        )}
                      >
                        <PlusIcon size={16} />
                      </span>
                    </div>
                  ) : (
                    <span className="text-grey-40">
                      {item.quantity - item.returned_quantity}
                    </span>
                  )}
                </Table.Cell>
              </Table.Row>
            </>
          )
        })}
      </Table.Body>
    </Table>
  )
}

const CreateFulfillmentModal: React.FC<CreateFulfillmentModalProps> = ({
  handleCancel,
  orderToFulfill,
  orderId,
}) => {
  const [toFulfill, setToFulfill] = useState<string[]>([])
  const [quantities, setQuantities] = useState({})
  const [noNotis, setNoNotis] = useState(false)
  const [metadata, setMetadata] = useState<MetadataField[]>([
    { key: "", value: "" },
  ])

  const items =
    "items" in orderToFulfill
      ? orderToFulfill.items
      : orderToFulfill.additional_items

  const createOrderFulfillment = useAdminCreateFulfillment(orderId)
  const createSwapFulfillment = useAdminFulfillSwap(orderId)
  const createClaimFulfillment = useAdminFulfillClaim(orderId)

  const toaster = useToaster()

  const createFulfillment = () => {
    const [type] = orderToFulfill.id.split("_")

    type actionType =
      | typeof createOrderFulfillment
      | typeof createSwapFulfillment
      | typeof createClaimFulfillment

    let action: actionType = createOrderFulfillment
    let successText = "Successfully fulfilled order"
    let requestObj

    const preparedMetadata = metadata.reduce((acc, next) => {
      if (next.key) {
        return {
          ...acc,
          [next.key]: next.value,
        }
      } else {
        return acc
      }
    }, {})

    switch (type) {
      case "swap":
        action = createSwapFulfillment
        successText = "Successfully fulfilled swap"
        requestObj = {
          metadata: preparedMetadata,
          no_notification: noNotis,
        } as AdminPostOrdersOrderSwapsSwapFulfillmentsReq
        break

      case "claim":
        action = createClaimFulfillment
        successText = "Successfully fulfilled claim"
        requestObj = {
          metadata: preparedMetadata,
          no_notification: noNotis,
        } as AdminPostOrdersOrderClaimsClaimFulfillmentsReq
        break

      default:
        requestObj = {
          metadata: preparedMetadata,
          no_notification: noNotis,
        } as AdminPostOrdersOrderFulfillmentsReq
        requestObj.items = toFulfill
          .map((itemId) => ({ item_id: itemId, quantity: quantities[itemId] }))
          .filter((t) => !!t)
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
          <span className="inter-xlarge-semibold">Create Fulfillment</span>
        </Modal.Header>
        <Modal.Content>
          <div className="flex flex-col">
            <span className="inter-base-semibold mb-2">Items</span>
            <ItemsTable
              items={items}
              toFulfill={toFulfill}
              setToFulfill={setToFulfill}
              quantities={quantities}
              setQuantities={setQuantities}
            />
            <div className="mt-4">
              <Metadata metadata={metadata} setMetadata={setMetadata} />
            </div>
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
              disabled={!toFulfill?.length}
              onClick={createFulfillment}
            >
              Complete
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default CreateFulfillmentModal
