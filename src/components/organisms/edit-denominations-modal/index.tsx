import React from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import CurrencyInput from "../../organisms/currency-input"
import Button from "../../fundamentals/button"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import InfoTooltip from "../../molecules/info-tooltip"
import Modal from "../../molecules/modal"

type Denomination = {
  currencyCode: string
  amount: number
  id: string
}

type EditDenominationsModalProps = {
  denominations: Denomination[]
  handleClose: () => void
  onSubmit: (denominations: Denomination[]) => void
  defaultNewAmount?: number
  defaultNewCurrencyCode?: string
  currencyCodes?: string[]
}

type FormValues = {
  denominations: Denomination[]
}

const EditDenominationsModal = ({
  denominations,
  onSubmit,
  handleClose,
  currencyCodes,
  defaultNewAmount = 1000,
  defaultNewCurrencyCode = "USD",
}: EditDenominationsModalProps) => {
  const { control } = useForm<FormValues>({
    defaultValues: {
      denominations,
    },
  })
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "denominations",
    keyName: "native_key",
  })

  const onAmountChange = (index) => {
    return (amount) => {
      update(index, { ...fields[index], amount })
    }
  }

  const onCurrencyChange = (index) => {
    return (currencyCode) => {
      update(index, { ...fields[index], currencyCode })
    }
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Edit Denominations</span>
        </Modal.Header>
        <Modal.Content>
          <div className="pt-1">
            <div className="flex items-center">
              <label className="inter-base-semibold text-grey-90 mr-1.5">
                Prices
              </label>
              <InfoTooltip content={"Helpful denominations"} />
            </div>
            {fields.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className="first:mt-0 mt-xsmall flex items-center"
                >
                  <div className="flex-1">
                    <CurrencyInput
                      currencyCodes={currencyCodes}
                      onChange={onCurrencyChange(index)}
                      currentCurrency={field.currencyCode}
                    >
                      <CurrencyInput.AmountInput
                        label="Amount"
                        onChange={onAmountChange(index)}
                        amount={field.amount}
                      />
                    </CurrencyInput>
                  </div>
                  <button className="ml-2xlarge">
                    <TrashIcon
                      onClick={() => remove(index)}
                      className="text-grey-40"
                      size="20"
                    />
                  </button>
                </div>
              )
            })}
          </div>
          <div className="mt-large">
            <Button
              onClick={() =>
                append({
                  amount: defaultNewAmount,
                  currencyCode: defaultNewCurrencyCode,
                  id: uuidv4(),
                })
              }
              type="button"
              variant="ghost"
              size="small"
            >
              <PlusIcon size={20} />
              Add a price
            </Button>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex justify-end">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClose}
              className="mr-2 min-w-[130px] justify-center"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              className="mr-2 min-w-[130px] justify-center"
              onClick={() => onSubmit(fields)}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default EditDenominationsModal
