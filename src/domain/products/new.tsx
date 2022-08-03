import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import Toaster from "../../components/declarative-toaster"
import FormToasterContainer from "../../components/molecules/form-toaster"
import { checkForDirtyState } from "../../utils/form-helpers"
import ProductForm from "./product-form"
import {
  ProductFormProvider,
  useProductForm,
} from "./product-form/form/product-form-context"

const TOAST_ID = "new-product-dirty"

const NewProductPage = () => {
  return (
    <ProductFormProvider>
      <ProductForm />
      <SaveNotification />
    </ProductFormProvider>
  )
}

const SaveNotification = ({ isLoading = false }) => {
  const {
    form: { formState },
    resetForm,
    additionalDirtyState,
    onCreate,
    onCreateDraft,
  } = useProductForm()
  const [visible, setVisible] = useState(false)

  const isDirty = checkForDirtyState(
    formState.dirtyFields,
    additionalDirtyState
  )

  useEffect(() => {
    if (isDirty) {
      setVisible(true)
    } else {
      setVisible(false)
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
          <FormToasterContainer.MultiActionButton
            actions={[
              {
                label: "Save and publish",
                onClick: onCreate,
              },
              {
                label: "Save as draft",
                onClick: onCreateDraft,
              },
            ]}
          >
            Save
          </FormToasterContainer.MultiActionButton>
          <FormToasterContainer.DiscardButton onClick={resetForm}>
            Discard
          </FormToasterContainer.DiscardButton>
        </FormToasterContainer.Actions>
      </FormToasterContainer>
    </Toaster>
  )
}

export default NewProductPage
