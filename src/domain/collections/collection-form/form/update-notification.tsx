import { useProductCollectionForm } from "./product-collection-form-context"
import React, { useEffect, useState } from "react"
import { FieldValues } from "react-hook-form"
import { checkForDirtyState } from "../../../../utils/form-helpers"
import toast from "react-hot-toast"
import Toaster from "../../../../components/declarative-toaster"
import FormToasterContainer from "../../../../components/molecules/form-toaster"
import { handleFormError } from "../../../../utils/handle-form-error"

const TOAST_ID = "edit-product-collection-dirty"

export const UpdateProductCollectionNotification = ({ isLoading = false }) => {
  const {
    formState,
    onSubmit,
    handleSubmit,
    resetForm,
    additionalDirtyState,
    metadata,
  } = useProductCollectionForm()
  const [visible, setVisible] = useState(false)
  const [blocking, setBlocking] = useState(true)

  const onUpdate = (values: FieldValues) => {
    onSubmit({ ...values }, metadata)
  }

  useEffect(() => {
    const timeout = setTimeout(setBlocking, 300, false)
    return () => clearTimeout(timeout)
  }, [])

  const isDirty = checkForDirtyState(
    formState.dirtyFields,
    additionalDirtyState
  )

  useEffect(() => {
    if (!blocking) {
      setVisible(isDirty)
    }

    return () => {
      toast.dismiss(TOAST_ID)
    }
  }, [isDirty])

  return (
    <Toaster
      visible={visible}
      duration={Infinity}
      id={TOAST_ID}
      position="bottom-right"
    >
      <FormToasterContainer isLoading={isLoading}>
        <FormToasterContainer.Actions>
          <FormToasterContainer.ActionButton
            onClick={handleSubmit(onUpdate, handleFormError)}
          >
            Save
          </FormToasterContainer.ActionButton>
          <FormToasterContainer.DiscardButton onClick={resetForm}>
            Discard
          </FormToasterContainer.DiscardButton>
        </FormToasterContainer.Actions>
      </FormToasterContainer>
    </Toaster>
  )
}
