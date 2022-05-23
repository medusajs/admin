import React, { FC, useState } from "react"
import { useForm } from "react-hook-form"
import { AddDiscountCodeInput } from "../../domain/orders/draft-orders/details"
import Button from "../fundamentals/button"
import Modal from "../molecules/modal"
import ReactSearchBox from "react-search-box"
import { Discount } from "@medusajs/medusa"
import medusaApi from "../../services/api"
import { Record } from "../../types/react-search-box"

export interface DiscountModal {
  handleClose: () => void
  handleSave: (data: AddDiscountCodeInput) => void
}

export const DiscountModal: FC<DiscountModal> = ({
  handleClose,
  handleSave,
}) => {
  const [discounts, setDiscounts] = useState([])
  const { handleSubmit, register, getValues, setValue } = useForm()
  const placeholder = getValues("code") ?? "Search Discounts"

  const handleSelect = (record: Record) => setValue("code", record.item.value)
  const handleChange = async (value: string) => {
    const res = await medusaApi.discounts.list({
      q: value,
      limit: 0,
      offset: 0,
    })

    const { discounts } = res.data

    setDiscounts(
      discounts.map((discount: Discount) => ({
        key: "code",
        value: discount.code,
      }))
    )
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <h2 className="inter-xlarge-semibold">Add a discount</h2>
        </Modal.Header>

        <form onSubmit={handleSubmit(handleSave)}>
          <Modal.Content>
            <ReactSearchBox
              {...register("code")}
              data={discounts}
              onChange={handleChange}
              onSelect={handleSelect}
              placeholder={placeholder}
            />
          </Modal.Content>

          <Modal.Footer>
            <Button
              type="submit"
              size="small"
              className="ml-auto w-[112px]"
              variant="primary"
            >
              Confirm
            </Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}
