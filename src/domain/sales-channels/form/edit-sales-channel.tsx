import React, { useState } from "react"
import { SalesChannel } from "@medusajs/medusa"
import Modal from "../../../components/molecules/modal"
import InputField from "../../../components/molecules/input"
import Button from "../../../components/fundamentals/button"
import Switch from "../../../components/atoms/switch"

type P = {
  salesChannel: SalesChannel
  handleClose: () => void
}

function EditSalesChannel(props: P) {
  const { handleClose, salesChannel } = props

  const [name, setName] = useState(salesChannel.name)
  const [description, setDescription] = useState(salesChannel.description)
  const [isDisabled, setIsDisabled] = useState(salesChannel.is_disabled)

  const handleSubmit = () => {}

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Sales channel details</span>
        </Modal.Header>
        <Modal.Content>
          <div className="flex justify-between items-center mb-4">
            <div className="inter-base-semibold text-grey-90">General info</div>
            <Switch
              checked={!isDisabled}
              onCheckedChange={(v) => setIsDisabled(!v)}
            />
          </div>
          <div className="w-full flex flex-col gap-3">
            <InputField
              label="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputField
              label="Description"
              name="description"
              value={description!}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex justify-end">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClose}
              className="mr-2"
            >
              Close
            </Button>
            <Button
              disabled={!name.length}
              variant="primary"
              className="min-w-[100px]"
              size="small"
              // loading={updateSalesChannel.isLoading}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default EditSalesChannel
