import { Product } from "@medusajs/medusa"
import React, { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import Switch from "../../../../../components/atoms/switch"
import Button from "../../../../../components/fundamentals/button"
import InputField from "../../../../../components/molecules/input"
import Modal from "../../../../../components/molecules/modal"
import Select from "../../../../../components/molecules/select"
import TagInput from "../../../../../components/molecules/tag-input"
import TextArea from "../../../../../components/molecules/textarea"
import { Option } from "../../../../../types/shared"
import FormValidator from "../../../../../utils/form-validator"
import useEditProductActions from "../../hooks/use-edit-product-actions"
import useGeneralData from "./use-general-data"

type Props = {
  product: Product
  open: boolean
  onClose: () => void
}

type GeneralForm = {
  title: string
  subtitle: string | null
  handle: string
  description: string | null
  type: Option | null
  collection: Option | null
  tags: string[] | null
  discountable: boolean
}

const GeneralModal = ({ product, open, onClose }: Props) => {
  const { productTypeOptions, collectionOptions } = useGeneralData()
  const { onUpdate, updating } = useEditProductActions(product.id)
  const {
    register,
    control,
    formState: { errors, isDirty },
    handleSubmit,
    reset,
  } = useForm<GeneralForm>({
    defaultValues: getDefaultValues(product),
  })

  useEffect(() => {
    reset(getDefaultValues(product))
  }, [product])

  const onReset = () => {
    reset(getDefaultValues(product))
    onClose()
  }

  const onSubmit = handleSubmit((data) => {
    onUpdate(
      {
        title: data.title,
        handle: data.handle,
        // @ts-ignore
        subtitle: data.subtitle,
        // @ts-ignore
        description: data.description,
        // @ts-ignore
        type: data.type
          ? {
              id: data.type.value,
              value: data.type.label,
            }
          : null,
        // @ts-ignore
        collection_id: data.collection ? data.collection.value : null,
        // @ts-ignore
        tags: data.tags ? data.tags.map((t) => ({ value: t })) : null,
        discountable: data.discountable,
      },
      onReset
    )
  })

  return (
    <Modal open={open} handleClose={onReset} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">
            Edit General Information
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="mb-xlarge">
              <h2 className="inter-large-semibold mb-base">Details</h2>
              <div className="grid grid-cols-2 gap-x-large mb-small">
                <InputField
                  label="Title"
                  required
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 1,
                      message: "Title must be at least 1 character",
                    },
                    pattern: FormValidator.whiteSpaceRule("Title"),
                  })}
                  errors={errors}
                />
                <InputField
                  label="Subtitle"
                  placeholder="Warm and cozy..."
                  {...register("subtitle", {
                    pattern: FormValidator.whiteSpaceRule("Subtitle"),
                  })}
                  errors={errors}
                />
              </div>
              <p className="inter-base-regular text-grey-50 mb-large">
                Give your product a short and clear title.
                <br />
                50-60 characters is the recommended length for search engines.
              </p>
              <div className="grid grid-cols-2 gap-x-large mb-large">
                <InputField
                  label="Handle"
                  required
                  {...register("handle", {
                    required: "Handle is required",
                    minLength: {
                      value: 1,
                      message: "Handle must be at least 1 character",
                    },
                    pattern: FormValidator.whiteSpaceRule("Handle"),
                  })}
                  prefix="/"
                  errors={errors}
                />
              </div>
              <TextArea
                label="Description"
                rows={3}
                className="mb-small"
                {...register("description", {
                  pattern: FormValidator.whiteSpaceRule("Description"),
                })}
                errors={errors}
              />
              <p className="inter-base-regular text-grey-50">
                Give your product a short and clear description.
                <br />
                120-160 characters is the recommended length for search engines.
              </p>
            </div>
            <div className="mb-xlarge">
              <h2 className="inter-base-semibold mb-base">Organize Product</h2>
              <div className="grid grid-cols-2 gap-x-large mb-large">
                <Controller
                  name="type"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Select
                        label="Type"
                        onChange={onChange}
                        options={productTypeOptions}
                        value={value || null}
                      />
                    )
                  }}
                />
                <Controller
                  name="collection"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Select
                        label="Collection"
                        onChange={onChange}
                        options={collectionOptions}
                        value={value}
                      />
                    )
                  }}
                />
              </div>
              <Controller
                control={control}
                name="tags"
                render={({ field: { value, onChange } }) => {
                  return <TagInput onChange={onChange} values={value || []} />
                }}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2xsmall">
                <h2 className="inter-base-semibold mb-2xsmall">Discountable</h2>
                <Controller
                  control={control}
                  name="discountable"
                  render={({ field: { value, onChange } }) => {
                    return <Switch checked={value} onCheckedChange={onChange} />
                  }}
                />
              </div>
              <p className="inter-base-regular text-grey-50">
                When unchecked discounts will not be applied to this product.
              </p>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex gap-x-2 justify-end w-full">
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={onReset}
              >
                Cancel
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                disabled={!isDirty}
                loading={updating}
              >
                Save
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (product: Product): GeneralForm => {
  return {
    title: product.title,
    subtitle: product.subtitle,
    handle: product.handle!,
    description: product.description || null,
    collection: product.collection
      ? { label: product.collection.title, value: product.collection.id }
      : null,
    type: product.type
      ? { label: product.type.value, value: product.type.id }
      : null,
    tags: product.tags ? product.tags.map((t) => t.value) : null,
    discountable: product.discountable,
  }
}

export default GeneralModal
