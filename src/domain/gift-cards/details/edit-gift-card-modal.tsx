import React, { useState } from "react"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import Select from "../../../components/molecules/select"

const EditGiftCardModal = ({
  handleClose,
  handleSave,
  updating,
  regions,
  region,
}) => {
  // const [code, setCode] = useState(giftCard.code)
  const [selectedRegion, setSelectedRegion] = useState({
    value: region.id,
    label: region.name,
  })

  const onSubmit = (e) => {
    e.preventDefault()
    if (handleSave) {
      handleSave({ region_id: selectedRegion.value })
    }
  }

  const regionOptions = regions.map((r) => ({
    label: r.name,
    value: r.id,
  }))

  return (
    <Modal handleClose={handleClose} isLargeModal={true}>
      <form onSubmit={(e) => onSubmit(e)}>
        <Modal.Body isLargeModal={true}>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">
              Edit Gift Card Details
            </span>
          </Modal.Header>
          <Modal.Content>
            {/* TODO: Missing backend support for updating code
            <InputField
              label="Code"
              name="code"
              value={code}
              onChange={({ currentTarget }) => setCode(currentTarget.value)}
              className="mb-4"
            /> */}
            <Select
              label="Region"
              options={regionOptions}
              value={selectedRegion}
              onChange={setSelectedRegion}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="w-full flex justify-end">
              <Button
                variant="ghost"
                size="small"
                onClick={handleClose}
                className="mr-2"
                type="button"
              >
                Cancel
              </Button>
              <Button
                loading={updating}
                variant="primary"
                className="min-w-[100px]"
                size="small"
                type="submit"
              >
                Save
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}
export default EditGiftCardModal
