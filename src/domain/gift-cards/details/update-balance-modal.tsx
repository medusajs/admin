import clsx from "clsx"
import React, { useState } from "react"
import Tooltip from "../../../components/atoms/tooltip"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import CurrencyInput from "../../../components/organisms/currency-input"

const UpdateBalanceModal = ({
  handleClose,
  handleSave,
  currencyCode,
  giftCard,
  updating,
}) => {
  const [balance, setBalance] = useState(giftCard.balance)

  const handleChange = (amount: number | undefined) => {
    if (typeof amount !== undefined) {
      setBalance(amount)
    }
  }

  const onSubmit = () => {
    if (handleSave) {
      handleSave({ balance })
    }
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Update Balance</span>
          <span
            className={clsx(
              "inter-small-regular text-rose-50 mt-2xsmall transition-display delay-75",
              {
                hidden: !(balance > giftCard.value),
              }
            )}
          >
            Balance can't be updated to a value that is greater than the
            original amount
          </span>
        </Modal.Header>
        <Modal.Content>
          <CurrencyInput readOnly currentCurrency={currencyCode} size="small">
            <CurrencyInput.AmountInput
              amount={giftCard.balance}
              label="Price"
              onChange={handleChange}
            />
          </CurrencyInput>
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex justify-end">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              loading={updating}
              variant="primary"
              className="min-w-[100px]"
              size="small"
              onClick={onSubmit}
              disabled={balance > giftCard.value}
            >
              {balance > giftCard.value ? (
                <Tooltip content="Balance is above original value">
                  Save
                </Tooltip>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}
export default UpdateBalanceModal
