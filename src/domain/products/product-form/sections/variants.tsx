import React, { useEffect, useState } from "react"
import Button from "../../../../components/fundamentals/button"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import InfoTooltip from "../../../../components/molecules/info-tooltip"
import Input from "../../../../components/molecules/input"
import TagInput from "../../../../components/molecules/tag-input"
import BodyCard from "../../../../components/organisms/body-card"
import VariantGrid from "../../../../components/variant-grid"
import { getCombinations } from "../../../../utils/get-combinations"
import NewOption from "../../details/variants/option-edit"
import { useProductForm } from "../form/product-form-context"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import VariantEditor from "../../details/variants/variant-editor"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import { useAdminCreateVariant } from "medusa-react"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { buildOptionsMap } from "../utils"

const Variants = ({ isEdit, product }) => {
  const {
    setValue,
    setVariants,
    variants,
    productOptions,
    setProductOptions,
  } = useProductForm()
  const [showAddVariantModal, setShowAddVariantModal] = useState(false)
  const [showAddOption, setShowAddOption] = useState(false)
  const notification = useNotification()
  const createVariant = useAdminCreateVariant(product?.id)

  useEffect(() => {
    if (isEdit) {
      return
    }

    const os = [...productOptions]
    const combinations = getCombinations(os)

    const newVariants = combinations.map((optionValues) => {
      if (!optionValues) {
        return null
      }

      const existing = variants.find((v) =>
        v.options.every((value, index) => optionValues[index] === value)
      ) || { prices: [] }

      existing.options = optionValues.filter((v) => v !== "")

      return existing
    })

    setVariants(newVariants.filter((v) => !!v))
  }, [productOptions])

  const updateOptionValue = (index, values) => {
    const newOptions = [...productOptions]
    newOptions[index] = {
      ...newOptions[index],
      values,
    }

    setValue(`options[${index}].values`, values)
    setProductOptions(newOptions)
  }

  const handleRemoveOption = (index) => {
    const newOptions = [...productOptions]
    newOptions.splice(index, 1)
    setProductOptions(newOptions)
  }

  const handleAddOption = (e) => {
    setProductOptions([
      ...productOptions,
      {
        name: "",
        values: [],
      },
    ])
  }

  const updateOptionName = (e, index) => {
    const element = e.target
    const newOptions = [...productOptions]
    newOptions[index] = {
      ...newOptions[index],
      name: element.value,
    }

    setValue(`options[${index}].name`, element.value)
    setProductOptions(newOptions)
  }

  const handleAddVariant = (data) => {
    createVariant.mutate(data, {
      onSuccess: () => {
        notification("Success", "Successfully added a variant", "success")
        setShowAddVariantModal(false)
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
      },
    })
  }

  return (
    <BodyCard
      title="Variants"
      subtitle="Add variations of this product. Offer your customers different options for price, color, format, size, shape, etc."
      forceDropdown={true}
      actionables={
        isEdit && [
          {
            label: "Add variant",
            onClick: () => setShowAddVariantModal(true),
            icon: <PlusIcon size={20} />,
          },
          {
            label: "Edit options",
            onClick: () => setShowAddOption(true),
            icon: <EditIcon size={20} />,
          },
        ]
      }
    >
      <div>
        {!isEdit && (
          <>
            <div className="flex items-center mb-base">
              <h6 className="inter-base-semibold text-grey-90 mr-1.5">
                Product Options
              </h6>
            </div>
            <div className="flex flex-col gap-y-base max-w-[570px] w-full mb-4">
              {productOptions.map((o, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex gap-x-small grow">
                    <Input
                      required
                      className="w-[144px]"
                      name={`options[${index}].name`}
                      onChange={(e) => updateOptionName(e, index)}
                      label="Option title"
                      placeholder="Color"
                      value={o?.name || o.title}
                    />
                    <TagInput
                      className="grow"
                      placeholder="Blue, Green"
                      values={o?.values}
                      onChange={(values) => updateOptionValue(index, values)}
                    />
                  </div>
                  <button
                    className="ml-large"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <TrashIcon className="text-grey-40" />
                  </button>
                </div>
              ))}
              <div className="mt-xs">
                <Button onClick={handleAddOption} size="small" variant="ghost">
                  + Add an option
                </Button>
              </div>
            </div>
            <div className="flex justify-center mb-base flex-col space-y-2">
              <div className="flex space-x-2">
                <h6 className="inter-base-semibold text-grey-90">Variants</h6>
                <InfoTooltip content="Add product options to create variants" />
              </div>
            </div>
          </>
        )}
        <VariantGrid
          edit={isEdit}
          product={product}
          variants={variants}
          onVariantsChange={(vars) => setVariants(vars)}
        />
      </div>
      {showAddOption && (
        <NewOption
          productId={product.id}
          options={product.options}
          onDismiss={() => setShowAddOption(false)}
        />
      )}
      {showAddVariantModal && (
        <VariantEditor
          onCancel={() => setShowAddVariantModal(false)}
          onSubmit={handleAddVariant}
          title="Add variant"
          optionsMap={buildOptionsMap(product)}
        />
      )}
    </BodyCard>
  )
}

export default Variants
