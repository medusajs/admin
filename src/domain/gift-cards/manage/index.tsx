import { RouteComponentProps } from "@reach/router"
import { useAdminProducts, useAdminUpdateProduct } from "medusa-react"
import React, { useEffect, useState } from "react"
import { FieldValues } from "react-hook-form"
import toast from "react-hot-toast"
import Spinner from "../../../components/atoms/spinner"
import Toaster from "../../../components/declarative-toaster"
import FormToasterContainer from "../../../components/molecules/form-toaster"
import useNotification from "../../../hooks/use-notification"
import Medusa from "../../../services/api"
import { consolidateImages } from "../../../utils/consolidate-images"
import { getErrorMessage } from "../../../utils/error-messages"
import { checkForDirtyState } from "../../../utils/form-helpers"
import { handleFormError } from "../../../utils/handle-form-error"
import {
  GiftCardFormProvider,
  useGiftCardForm,
} from "./form/gift-card-form-context"
import {
  formValuesToUpdateGiftCardMapper,
  giftCardToFormValuesMapper,
} from "./form/mappers"
import Denominations from "./sections/denominations"
import Images from "./sections/images"
import Information from "./sections/information"

const ManageGiftCard: React.FC<RouteComponentProps> = () => {
  const { products } = useAdminProducts(
    {
      is_giftcard: "true",
    },
    {
      keepPreviousData: true,
    }
  )

  const giftCard = products?.[0]

  const notification = useNotification()
  const updateGiftCard = useAdminUpdateProduct(giftCard?.id!)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (data) => {
    setSubmitting(true)
    const images = data.images
      .filter((img) => img.url.startsWith("blob"))
      .map((img) => img.nativeFile)

    let uploadedImgs = []
    if (images.length > 0) {
      uploadedImgs = await Medusa.uploads
        .create(images)
        .then(({ data }) => {
          const uploaded = data.uploads.map(({ url }) => url)
          return uploaded
        })
        .catch((err) => {
          setSubmitting(false)
          notification("Error uploading images", getErrorMessage(err), "error")
          return
        })
    }

    const newData = {
      ...data,
      images: consolidateImages(data.images, uploadedImgs),
    }

    updateGiftCard.mutate(formValuesToUpdateGiftCardMapper(newData), {
      onSuccess: () => {
        setSubmitting(false)
        notification("Success", "Product updated successfully", "success")
      },
      onError: (error) => {
        setSubmitting(false)
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  if (!giftCard) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner variant="secondary" size="large" />
      </div>
    )
  }

  return (
    <GiftCardFormProvider
      giftCard={giftCardToFormValuesMapper(giftCard)}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-y-large pb-xlarge">
        <Information giftCard={giftCard} />
        <Denominations giftCard={giftCard} />
        <Images />
      </div>
      <UpdateNotification isLoading={submitting} />
    </GiftCardFormProvider>
  )
}

const TOAST_ID = "edit-gc-dirty"

const UpdateNotification = ({ isLoading = false }) => {
  const {
    formState,
    onSubmit,
    handleSubmit,
    resetForm,
    additionalDirtyState,
  } = useGiftCardForm()
  const [visible, setVisible] = useState(false)
  const [blocking, setBlocking] = useState(true)

  const onUpdate = (values: FieldValues) => {
    onSubmit({ ...values })
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

export default ManageGiftCard
