import { AdminPostDiscountsReq } from "@medusajs/medusa"
import React, { FC } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  AddDiscountCodeInput,
  DiscountOption,
} from "../../domain/orders/draft-orders/details"
import Button from "../fundamentals/button"
import Modal from "../molecules/modal"
import Select from "../molecules/select"

export interface DiscountModal {
  discountOptions: DiscountOption[]
  handleClose: () => void
  handleSave: (data: AddDiscountCodeInput) => void
}

export const DiscountModal: FC<DiscountModal> = ({
  discountOptions,
  handleClose,
  handleSave,
}) => {
  const { control, handleSubmit } = useForm()

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <h2 className="inter-xlarge-semibold">Add a discount</h2>
        </Modal.Header>

        <form onSubmit={handleSubmit(handleSave)}>
          <Modal.Content>
            <Controller
              name="code"
              control={control}
              defaultValue={{ label: "Discount", value: "discount" }}
              rules={{ required: true }}
              render={(props) => (
                <Select
                  label="Discount"
                  options={discountOptions}
                  value={props.value}
                  onChange={props.onChange}
                />
              )}
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
