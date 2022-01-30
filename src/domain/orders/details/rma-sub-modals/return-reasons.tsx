import { useAdminReturnReasons } from "medusa-react"
import React, { useContext, useState } from "react"
import Button from "../../../../components/fundamentals/button"
import InputField from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import Select from "../../../../components/molecules/select"

type RMAReturnReasonSubModalProps = {
  onSubmit: (reason, note) => void
}

// {
//   // onSelectReturnReason,
//   // enableImages,
// }
const RMAReturnReasonSubModal: React.FC<RMAReturnReasonSubModalProps> = ({
  onSubmit,
}) => {
  const { pop } = useContext(LayeredModalContext)
  const { isLoading, return_reasons } = useAdminReturnReasons()
  const [note, setNote] = useState("")
  const [selectedReason, setSelectedReason] = useState()

  console.log(return_reasons)

  const onChange = (value) => {
    setNote(value.target.value)
  }

  return (
    <>
      <Modal.Content>
        <div className="h-full">
          <h2 className="inter-base-semibold mb-4">Reason for Return</h2>
          <Select
            label="Reason"
            value={selectedReason}
            onChange={setSelectedReason}
            options={
              return_reasons?.map(({ id, label }) => ({ value: id, label })) ||
              []
            }
          />
          <InputField
            label={"note"}
            value={note}
            className="my-4"
            onChange={(val) => onChange(val)}
          />
        </div>
      </Modal.Content>
      <Modal.Footer>
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
            disabled={typeof selectedReason === "undefined"}
            onClick={() => {
              onSubmit(selectedReason?.value, note)
              pop()
            }}
          >
            Add
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export default RMAReturnReasonSubModal
