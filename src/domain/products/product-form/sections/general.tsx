import {
  useAdminCollections,
  useAdminDeleteProduct,
  useAdminProduct,
  useAdminProductTypes,
  useAdminUpdateProduct,
} from "medusa-react"
import React from "react"
import { Controller } from "react-hook-form"
import Input from "../../../../components/molecules/input"
import Select from "../../../../components/molecules/select"
import TagInput from "../../../../components/molecules/tag-input"
import Textarea from "../../../../components/molecules/textarea"
import BodyCard from "../../../../components/organisms/body-card"
import RadioGroup from "../../../../components/organisms/radio-group"
import useImperativeDialog from "../../../../hooks/use-imperative-dialog"
import {
  SINGLE_PRODUCT_VIEW,
  useProductForm,
  VARIANTS_VIEW,
} from "../form/product-form-context"
import { useParams } from "@reach/router"
import useNotification from "../../../../hooks/use-notification"
import { navigate } from "gatsby"
import { getErrorMessage } from "../../../../utils/error-messages"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import StatusSelector from "../../../../components/molecules/status-selector"

const General = ({ showViewOptions = true, isEdit = false }) => {
  const { register, control, setViewType, viewType } = useProductForm()
  const { types } = useAdminProductTypes()
  const { collections } = useAdminCollections()

  const typeOptions =
    types?.map((tag) => ({ label: tag.value, value: tag.id })) || []
  const collectionOptions =
    collections?.map((collection) => ({
      label: collection.title,
      value: collection.id,
    })) || []

  return (
    <GeneralBodyCard
      isEdit={isEdit}
      title="General"
      subtitle="To start selling, all you need is a name, price, and image"
    >
      <div className="mt-large">
        <h6 className="inter-base-semibold mb-1">Details</h6>
        <label
          htmlFor="name"
          className="inter-small-regular text-grey-50 block max-w-[370px] mb-base"
        >
          Give your product a short and clear name. 50-60 characters is the
          recommended length for search engines.
        </label>
        <div className="flex gap-8 mb-base">
          <Input
            id="name"
            label="Name"
            name="title"
            placeholder="Jacket, Sunglasses..."
            required
            ref={register({ required: true })}
          />
          <Input
            tooltipContent="Handles are human friendly unique identifiers that are appropriate for URL slugs."
            label="Handle"
            name="handle"
            placeholder="/bathrobe"
            ref={register({ required: true })}
          />
        </div>
        <label
          className="inter-small-regular text-grey-50 block max-w-[370px] mb-base"
          htmlFor="description"
        >
          Give your product a short and clear description. 120-160 characters is
          the recommended length for search engines.
        </label>
        <div className="grid grid-rows-3 grid-cols-2 gap-x-8 gap-y-4 mb-xlarge">
          <Textarea
            name="description"
            id="description"
            label="Description"
            placeholder="Short description of the product..."
            className="row-span-full"
            rows={8}
            ref={register}
          />
          <Controller
            as={Select}
            control={control}
            label="Collection"
            name="collection"
            overrideStrings={{ selectSomeItems: "Select collection..." }}
            options={collectionOptions}
          />
          <Controller
            as={Select}
            control={control}
            label="Type"
            name="type"
            overrideStrings={{ selectSomeItems: "Select type..." }}
            options={typeOptions}
          />
          <Controller
            name="tags"
            render={({ onChange, value }) => {
              return (
                <TagInput
                  label="Tags (separated by comma)"
                  placeholder="Spring, Summer..."
                  onChange={onChange}
                  values={value || []}
                />
              )
            }}
            control={control}
          />
        </div>
        {showViewOptions && (
          <RadioGroup.Root
            value={viewType}
            onValueChange={setViewType}
            className="flex items-center gap-4"
          >
            <RadioGroup.SimpleItem
              label="Simple product"
              value={SINGLE_PRODUCT_VIEW}
            />
            <RadioGroup.SimpleItem
              label="Product with variants"
              value={VARIANTS_VIEW}
            />
          </RadioGroup.Root>
        )}
      </div>
    </GeneralBodyCard>
  )
}

const GeneralBodyCard = ({ isEdit, ...props }) => {
  const params = useParams()
  const dialog = useImperativeDialog()
  const notification = useNotification()
  const { product } = useAdminProduct(params.id)
  const updateProduct = useAdminUpdateProduct(params?.id)
  const deleteProduct = useAdminDeleteProduct(params?.id)

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Product",
      text: "Are you sure you want to delete this product",
    })
    if (shouldDelete) {
      deleteProduct.mutate(undefined, {
        onSuccess: () => {
          notification("Success", "Product deleted successfully", "success")
          navigate("/a/products/")
        },
        onError: (err) => {
          notification("Ooops", getErrorMessage(err), "error")
        },
      })
    }
  }

  const onStatusChange = async () => {
    const newStatus = product?.status === "published" ? "draft" : "published"
    updateProduct.mutate(
      {
        status: newStatus,
      },
      {
        onSuccess: () => {
          const pastTense = newStatus === "published" ? "published" : "drafted"
          notification(
            "Success",
            `Product ${pastTense} successfully`,
            "success"
          )
        },
        onError: (err) => {
          notification("Ooops", getErrorMessage(err), "error")
        },
      }
    )
  }

  const actionables = [
    {
      label: "Delete Product",
      onClick: onDelete,
      variant: "danger" as const,
      icon: <TrashIcon />,
    },
  ]

  return (
    <BodyCard
      actionables={isEdit ? actionables : undefined}
      forceDropdown
      status={
        isEdit ? (
          <StatusSelector
            isDraft={product?.status === "draft"}
            activeState="Published"
            draftState="Draft"
            onChange={onStatusChange}
          />
        ) : undefined
      }
      {...props}
    />
  )
}

export default General
