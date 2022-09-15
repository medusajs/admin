import { Order } from "@medusajs/medusa"
import {
  useAdminCreateSwap,
  useAdminOrder,
  useAdminShippingOptions,
} from "medusa-react"
import React, { useMemo } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import Checkbox from "../../../../components/atoms/checkbox"
import Button from "../../../../components/fundamentals/button"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Modal from "../../../../components/molecules/modal"
import LayeredModal, {
  useLayeredModal,
} from "../../../../components/molecules/modal/layered-modal"
import { NextSelect } from "../../../../components/molecules/select/next-select"
import useNotification from "../../../../hooks/use-notification"
import { Option } from "../../../../types/shared"

type Props = {
  onClose: () => void
  open: boolean
  order: Order
}

type ReturnItem = {
  item_id: string
  quantity: number
  note?: string
  reason?: Option
}

type AdditionalItem = {
  quantity: number
  variant_id: string
}

type ReturnShipping = {
  option: Option
  price?: number
}

type CreateSwapFormType = {
  send_notifications: boolean
  return_items: ReturnItem[]
  additional_items: AdditionalItem[]
  return_shipping: ReturnShipping
}

const SwapModal = ({ order, onClose, open }: Props) => {
  const context = useLayeredModal()
  const notification = useNotification()

  const { refetch } = useAdminOrder(order.id)
  const { mutate, isLoading: isMutating } = useAdminCreateSwap(order.id)

  const { control, handleSubmit } = useForm<CreateSwapFormType>()

  const {
    shipping_options: returnOptions,
    isLoading: isLoadingReturnOptions,
  } = useAdminShippingOptions({
    region_id: order.region_id,
    is_return: true,
  })

  const returnShippingOptions = useMemo(() => {
    return (
      returnOptions?.map((o) => ({
        label: o.name,
        value: o.id,
      })) || []
    )
  }, [returnOptions])

  const selectedReturnOption = useWatch({
    control,
    name: "return_shipping.option",
  })

  const selectedReturnOptionPrice = useWatch({
    control,
    name: "return_shipping.price",
  })

  const onSubmit = handleSubmit((data) => {
    mutate({
      return_items: data.return_items.map((ri) => ({
        item_id: ri.item_id,
        quantity: ri.quantity,
        note: ri.note,
        reason: ri.reason?.value,
      })),
      additional_items: data.additional_items,
      no_notification: !data.send_notifications,
      return_shipping: {
        option_id: data.return_shipping.option.value,
        price: data.return_shipping.price,
      },
    })
  })

  return (
    <LayeredModal context={context} open={open} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">Register Exchange</h1>
        </Modal.Header>
        <Modal.Content>
          <div>
            <h2>Shipping</h2>
            <Controller
              control={control}
              name="return_shipping.option"
              render={({ field: { value, onChange, onBlur } }) => {
                return (
                  <NextSelect
                    label="Shipping method"
                    options={returnShippingOptions}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )
              }}
            />
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex items-center justify-between">
            <Controller
              control={control}
              name="send_notifications"
              render={({ field: { value, onChange } }) => {
                return (
                  <div className="flex items-center gap-x-xsmall">
                    <Checkbox
                      label="Send notifications"
                      checked={value}
                      onChange={onChange}
                    />
                    <IconTooltip
                      type="info"
                      content="If unchecked the customer will not receive communication about this exchange."
                    />
                  </div>
                )
              }}
            />
            <Button variant="primary" loading={isMutating}>
              Complete
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}
