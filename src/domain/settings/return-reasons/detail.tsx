import { navigate } from "gatsby"
import {
  useAdminDeleteReturnReason,
  useAdminUpdateReturnReason,
} from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import DuplicateIcon from "../../../components/fundamentals/icons/duplicate-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Input from "../../../components/molecules/input"
import BodyCard from "../../../components/organisms/body-card"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import useModal from "../../../hooks/use-modal"
import useToaster from "../../../hooks/use-toaster"
import { getErrorMessage } from "../../../utils/error-messages"
import CreateReturnReasonModal from "./create-reason-modal"

const ReturnReasonDetail = ({ reason }) => {
  const {
    isOpen: showDuplicateModal,
    handleOpen: handleOpenDuplicateModal,
    handleClose: handleCloseDuplicateModal,
  } = useModal()
  const {
    isOpen: showDanger,
    handleClose: handleClosePrompt,
    handleOpen: handleOpenPrompt,
  } = useModal()
  const { register, reset, handleSubmit } = useForm()
  const toaster = useToaster()
  const deleteRR = useAdminDeleteReturnReason(reason?.id)
  const updateRR = useAdminUpdateReturnReason(reason?.id)

  const handleDeletion = async () => {
    deleteRR.mutate(null)
  }

  const onSave = data => {
    if (data.label === "") return
    updateRR.mutate(data, {
      onSuccess: () => {
        toaster("Successfully updated return reason", "success")
      },
      onError: error => {
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
            onClick: () => handleOpenPrompt(),
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
      {showDanger && (
        <DeletePrompt
          heading="Delete Return Reason"
          text="Are you sure you want to delete this return reason?"
          handleClose={handleClosePrompt}
          onDelete={handleDeletion}
        />
      )}
    </>
  )
}

export default ReturnReasonDetail
