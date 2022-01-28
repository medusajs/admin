import React from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { v4 as uuidv4 } from "uuid"
import Button from "../../fundamentals/button"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import InfoTooltip from "../../molecules/info-tooltip"
import Modal from "../../molecules/modal"
import CurrencyInput from "../../organisms/currency-input"

export type PriceType = {
  currency_code: string
  amount: number
  id: string
}

type EditDenominationsModalProps = {
  defaultDenominations: PriceType[]
  handleClose: () => void
  onSubmit: (denominations: PriceType[]) => void
  defaultNewAmount?: number
  defaultNewCurrencyCode?: string
  currencyCodes?: string[]
}

type FormValues = {
  denominations: PriceType[]
}

const augmentWithId = (obj) => ({ ...obj, id: obj.id ? obj.id : uuidv4() })

const augmentWithIds = (list) => {
  return list.map(augmentWithId)
}

const EditDenominationsModal = ({
  defaultDenominations = [],
  onSubmit,
  handleClose,
  currencyCodes,
  defaultNewAmount = 1000,
  defaultNewCurrencyCode = "USD",
}: EditDenominationsModalProps) => {
  const [denominations, setDenominations] = React.useState(
    augmentWithIds(defaultDenominations)
  )

  const onAmountChange = (index) => {
    return (amount) => {
      const newDenominations = denominations.slice()
      newDenominations[index] = { ...newDenominations[index], amount }
      setDenominations(newDenominations)
    }
  }

  const onCurrencyChange = (index) => {
    return (currencyCode) => {
      const newDenominations = denominations.slice()
      newDenominations[index] = {
        ...newDenominations[index],
        currency_code: currencyCode,
      }
      setDenominations(newDenominations)
    }
  }

  const onClickDelete = (index) => {
    return () => {
      const newDenominations = denominations.slice()
      newDenominations.splice(index, 1)
      setDenominations(newDenominations)
    }
  }

  const appendDenomination = (newDenomination) => {
    setDenominations([...denominations, augmentWithId(newDenomination)])
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
            {denominations.map((field, index) => {
              return (
                <div
                  key={field.id}
                  className="first:mt-0 mt-xsmall flex items-center"
                >
                  <div className="flex-1">
                    <CurrencyInput
                      currencyCodes={currencyCodes}
                      currentCurrency={field.currency_code}
                      onChange={onCurrencyChange(index)}
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
                      onClick={onClickDelete(index)}
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
                appendDenomination({
                  currency_code: defaultNewCurrencyCode,
                  amount: defaultNewAmount,
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
              onClick={() => onSubmit(denominations)}
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
