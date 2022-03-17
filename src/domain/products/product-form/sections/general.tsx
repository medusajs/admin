import { useParams } from "@reach/router"
import { navigate } from "gatsby"
import {
  useAdminCollections,
  useAdminDeleteProduct,
  useAdminProductTypes,
  useAdminUpdateProduct,
} from "medusa-react"
import React from "react"
import { Controller } from "react-hook-form"
import Checkbox from "../../../../components/atoms/checkbox"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import InfoTooltip from "../../../../components/molecules/info-tooltip"
import Input from "../../../../components/molecules/input"
import Select from "../../../../components/molecules/select"
import StatusSelector from "../../../../components/molecules/status-selector"
import TagInput from "../../../../components/molecules/tag-input"
import Textarea from "../../../../components/molecules/textarea"
import BodyCard from "../../../../components/organisms/body-card"
import RadioGroup from "../../../../components/organisms/radio-group"
import useImperativeDialog from "../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import {
  SINGLE_PRODUCT_VIEW,
  useProductForm,
  VARIANTS_VIEW,
} from "../form/product-form-context"

const General = ({ showViewOptions = true, isEdit = false, product }) => {
  const {
    register,
    control,
    setViewType,
    viewType,
    setValue,
  } = useProductForm()
  const { product_types } = useAdminProductTypes(undefined, { cacheTime: 0 })
  const { collections } = useAdminCollections()

  const typeOptions =
    product_types?.map((tag) => ({ label: tag.value, value: tag.id })) || []
  const collectionOptions =
    collections?.map((collection) => ({
      label: collection.title,
      value: collection.id,
    })) || []

  const setNewType = (value: string) => {
    const newType = {
      label: value,
      value,
    }

    typeOptions.push(newType)
    setValue("type", newType)

    return newType
  }

  return (
    <GeneralBodyCard
      isEdit={isEdit}
      product={product}
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
            ref={register({
              required: true,
              minLength: 1,
              pattern: /(.|\s)*\S(.|\s)*/,
            })}
          />
          <Input
            tooltipContent="Handles are human friendly unique identifiers that are appropriate for URL slugs."
            label="Handle"
            name="handle"
            placeholder="/bathrobe"
            ref={register()}
          />
        </div>
        <label
          className="inter-small-regular text-grey-50 block max-w-[370px] mb-base"
          htmlFor="description"
        >
          Give your product a short and clear description. 120-160 characters is
          the recommended length for search engines.
        </label>
        <div className="grid grid-rows-3 grid-cols-2 gap-x-8 gap-y-4 mb-large">
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
            placeholder="Select collection..."
            options={collectionOptions}
            clearSelected
          />
          <Controller
            control={control}
            name="type"
            render={({ value, onChange }) => {
              return (
                <Select
                  label="Type"
                  placeholder="Select type..."
                  options={typeOptions}
                  onChange={onChange}
                  value={value}
                  isCreatable
                  onCreateOption={(value) => {
                    return setNewType(value)
                  }}
                  clearSelected
                />
              )
            }}
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
        <div className="flex item-center gap-x-1.5 mb-xlarge">
          <Checkbox name="discountable" ref={register} label="Discountable" />
          <InfoTooltip
            content={
              "When unchecked discounts will not be applied to this product"
            }
          />
        </div>
        {showViewOptions && (
          <RadioGroup.Root
            value={viewType}
            onValueChange={setViewType}
            className="flex items-center gap-4 mt-xlarge"
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

const GeneralBodyCard = ({ isEdit, product, ...props }) => {
  const params = useParams()
  const dialog = useImperativeDialog()
  const notification = useNotification()
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
