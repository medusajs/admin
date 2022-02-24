import {
  useAdminCreateProductOption,
  useAdminDeleteProductOption,
  useAdminUpdateProductOption,
} from "medusa-react"
import React, { useMemo, useState } from "react"
import Button from "../../../../components/fundamentals/button"
import Input from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"

const NewOption = ({ productId, options, onDismiss }) => {
  const optionsArray = useMemo(() => {
    return [...options]
  }, [options])

  const [toSave, setToSave] = useState(optionsArray)
  const notification = useNotification()

  const createOption = useAdminCreateProductOption(productId)
  const updateOption = useAdminUpdateProductOption(productId)
  const deleteOption = useAdminDeleteProductOption(productId)

  const onAddOption = (e) => {
    e.preventDefault()
    setToSave((prev) => {
      const newVal = [...prev]
      newVal.push({
        id: `${Math.random()}`,
        title: "",
        isNew: true,
      })
      return newVal
    })
  }

  const onRemove = (id) => {
    setToSave((prev) => {
      const newVal = [...prev]
      const idx = newVal.findIndex((o) => o.id === id)
      if (idx !== -1) {
        const editVal = newVal[idx]
        if (editVal.created_at) {
          newVal.splice(idx, 1, { ...editVal, isRemoved: true })
          return newVal
        } else {
          newVal.splice(idx, 1)
          return newVal
        }
      }
      return prev
    })
  }

  const onChange = (id, e) => {
    const value = e.target.value
    setToSave((prev) => {
      const newVal = [...prev]
      const idx = newVal.findIndex((o) => o.id === id)
      if (idx !== -1) {
        const editVal = newVal[idx]
        newVal.splice(idx, 1, { ...editVal, title: value, editted: true })
        return newVal
      }
      return prev
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    await Promise.all(
      toSave.map(async (o) => {
        if (o.isRemoved) {
          return deleteOption.mutateAsync(o.id)
        } else if (o.isNew) {
          return createOption.mutateAsync({
            title: o.title,
          })
        } else if (o.editted) {
          return updateOption.mutateAsync({
            option_id: o.id,
            title: o.title,
          })
        }
      })
    )
      .then(() => {
        notification("Success", "Options updated", "success")
        onDismiss()
      })
      .catch((err) => {
        notification("Error", getErrorMessage(err), "error")
      })
  }

  return (
    <Modal handleClose={onDismiss} isLargeModal={false}>
      <form onSubmit={onSubmit}>
        <Modal.Body>
          <Modal.Header handleClose={onDismiss}>
            <h2>Add Option</h2>
          </Modal.Header>
          <Modal.Content>
            {toSave.map(
              (o, index) =>
                !o.isRemoved && (
                  <div className="mb-2" key={o.id}>
                    <Input
                      deletable
                      label="Title"
                      name={`toAdd[${index}].title`}
                      value={o.title}
                      onChange={(v) => onChange(o.id, v)}
                      onDelete={() => onRemove(o.id)}
                    />
                  </div>
                )
            )}
            <div className="flex w-full justify-end mt-4">
              <Button size="small" variant="secondary" onClick={onAddOption}>
                + Add option
              </Button>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full h-8 justify-end">
              <Button
                variant="ghost"
                className="mr-2 w-32 text-small justify-center"
                size="large"
                onClick={onDismiss}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default NewOption
