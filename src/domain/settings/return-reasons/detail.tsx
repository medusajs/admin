import {
  useAdminDeleteReturnReason,
  useAdminUpdateReturnReason,
} from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import DuplicateIcon from "../../../components/fundamentals/icons/duplicate-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import BodyCard from "../../../components/organisms/body-card"
import useModal from "../../../hooks/use-modal"
import useToaster from "../../../hooks/use-toaster"
import { getErrorMessage } from "../../../utils/error-messages"
import CreateReturnReasonModal from "./create-reason-modal"
import ReactDOM from "react-dom"

const DeleteDialog = ({
  open,
  heading,
  text,
  onConfirm,
  onCancel,
  confirmText = "Yes, confirm",
  cancelText = "Cancel",
}) => {
  console.log({ onCancel, onConfirm })
  return (
    <Modal open={open} handleClose={onCancel}>
      <Modal.Body>
        <Modal.Content>
          <div className="flex flex-col">
            <span className="inter-large-semibold">{heading}</span>
            <span className="inter-base-regular mt-1 text-grey-50">{text}</span>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full h-8 justify-end">
            <Button
              variant="ghost"
              className="mr-2 w-24 text-small justify-center"
              size="small"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
            <Button
              size="small"
              className="w-24 text-small justify-center"
              variant="danger"
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

const useDialog = () => {
  return ({ heading, text }) => {
    // We want a promise here so we can "await" the user's action (either confirm or cancel)
    return new Promise((resolve) => {
      const mountNode = document.createElement("div")
      mountNode.setAttribute("id", "testinggg")
      let open = true

      const onConfirm = () => {
        open = false
        resolve(true)
        // trigger a rerender to close the dialog
        render()
      }

      const onCancel = () => {
        open = false
        resolve(false)
        // trigger a rerender to close the dialog
        render()
      }

      // attach the dialog in the mount node
      const render = () => {
        ReactDOM.render(
          <DeleteDialog
            heading={heading}
            text={text}
            open={open}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />,
          mountNode
        )
      }

      render()
    })
  }
}

const ReturnReasonDetail = ({ reason }) => {
  const {
    isOpen: showDuplicateModal,
    handleOpen: handleOpenDuplicateModal,
    handleClose: handleCloseDuplicateModal,
  } = useModal()
  const { register, reset, handleSubmit } = useForm()
  const toaster = useToaster()
  const deleteRR = useAdminDeleteReturnReason(reason?.id)
  const updateRR = useAdminUpdateReturnReason(reason?.id)
  const dialog = useDialog()

  const handleDeletion = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Return Reason",
      text: "Are you sure you want to delete this return reason?",
    })
    if (shouldDelete) {
      deleteRR.mutate()
    }
  }

  const onSave = (data) => {
    if (data.label === "") {
      return
    }
    updateRR.mutate(data, {
      onSuccess: () => {
        toaster("Successfully updated return reason", "success")
      },
      onError: (error) => {
        toaster(getErrorMessage(error), "error")
      },
    })
  }

  const handleCancel = () => {
    reset({
      label: reason.label,
      description: reason.description,
    })
  }

  useEffect(() => {
    if (reason) {
      reset({
        label: reason.label,
        description: reason.description,
      })
    }
  }, [reason])

  return (
    <>
      <BodyCard
        actionables={[
          {
            label: "Duplicate reason",
            icon: <DuplicateIcon size={20} />,
            onClick: () => handleOpenDuplicateModal(),
          },
          {
            label: "Delete reason",
            variant: "danger",
            icon: <TrashIcon size={20} />,
            onClick: handleDeletion,
          },
        ]}
        events={[
          {
            label: "Save",
            onClick: handleSubmit(onSave),
          },
          {
            label: "Cancel changes",
            onClick: handleCancel,
          },
        ]}
        title="Details"
        subtitle={reason?.value}
      >
        <form onSubmit={handleSubmit(onSave)}>
          <Input ref={register} name="label" label="Label" />
          <Input
            ref={register}
            name="description"
            label="Description"
            className="mt-base"
          />
        </form>
      </BodyCard>
      {showDuplicateModal && (
        <CreateReturnReasonModal
          initialReason={reason}
          handleClose={handleCloseDuplicateModal}
        />
      )}
    </>
  )
}

export default ReturnReasonDetail
