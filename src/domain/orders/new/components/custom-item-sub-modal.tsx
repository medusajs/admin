import React, { useContext, useState } from "react"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import { useForm } from "react-hook-form"
import InputField from "../../../../components/molecules/input"
import CurrencyInput from "../../../../components/organisms/currency-input"

type CustomItemSubModalProps = {
  onSubmit: (title: string, amount: number, quantity: number) => void
  region: any
  isLargeModal?: boolean
}

const CustomItemSubModal: React.FC<CustomItemSubModalProps> = ({
  onSubmit,
  region,
  isLargeModal = true,
}) => {
  const [amount, setAmount] = useState(0)
  const { pop } = useContext(LayeredModalContext)

  const { register, handleSubmit } = useForm()

  const onSubmitItem = (data) => {
    const { title, quantity } = data
    onSubmit(title, quantity, amount)
    pop()
  }

  return (
    <>
      <Modal.Content isLargeModal={isLargeModal}>
        <div className="min-h-[705px] gap-y-xsmall">
          <InputField
            placeholder="E.g. Gift wrapping"
            label="Title"
            name="title"
            className="my-4"
            required
            ref={register({ required: true })}
          />
          <CurrencyInput
            currentCurrency={region.currency_code}
            size="small"
            readOnly
          >
            <CurrencyInput.AmountInput
              required
              label="Price"
              amount={amount}
              onChange={(value) => setAmount(value || 0)}
            />
          </CurrencyInput>
          <InputField
            className="my-4"
            label="Quantity"
            name="quantity"
            type="number"
            required
            ref={register({ required: true })}
          />
        </div>
      </Modal.Content>
      <Modal.Footer isLargeModal={isLargeModal}>
        <div className="flex w-full justify-end gap-x-xsmall">
          <Button
            variant="ghost"
            size="small"
            className="w-[112px]"
            onClick={() => pop()}
          >
            Back
          </Button>
          <Button
            variant="primary"
            className="w-[112px]"
            size="small"
            onClick={handleSubmit(onSubmitItem)}
          >
            Add
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export default CustomItemSubModal
