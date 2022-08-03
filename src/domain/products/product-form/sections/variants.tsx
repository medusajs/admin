import { useAdminCreateVariant } from "medusa-react"
import React, { useState } from "react"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../../../components/organisms/body-card"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
import NewOption from "../../details/variants/option-edit"
import VariantEditor from "../../details/variants/variant-editor"
import { useProductForm } from "../form/product-form-context"
import { buildOptionsMap } from "../utils/helpers"
import CreateVariants from "./variants/create"
import EditVariants from "./variants/edit"

const Variants = ({ isEdit, product }) => {
  const [showAddVariantModal, setShowAddVariantModal] = useState(false)
  const [showAddOption, setShowAddOption] = useState(false)
  const notification = useNotification()
  const createVariant = useAdminCreateVariant(product?.id)

  const { form } = useProductForm()

  const handleAddVariant = (data) => {
    const newVariant = {
      ...data,
      inventory_quantity: data.inventory_quantity || 0,
    }

    createVariant.mutate(newVariant, {
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
      {/* <div>
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
                  <div className="flex gap-x-2xsmall grow">
                    <Input
                      required
                      className="w-[144px]"
                      name={`options[${index}].name`}
                      onChange={(e) => updateOptionName(e, index)}
                      label="Option title"
                      placeholder="Color, Size..."
                      value={o?.name || o.title}
                    />
                    <TagInput
                      className="grow"
                      placeholder="Blue, Green..."
                      values={o?.values}
                      onChange={(values) => updateOptionValue(index, values)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="small"
                    className="ml-base"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <TrashIcon className="text-grey-40" size={20} />
                  </Button>
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
                <IconTooltip content="Add product options to create variants" />
              </div>
            </div>
          </>
        )}
        {isEdit ? (
          <EditVariants product={product} />
        ) : (
          <VariantGrid
            edit={isEdit}
            product={product}
            variants={variants}
            onVariantsChange={(vars) => setVariants(vars)}
          />
        )}
      </div> */}
      {!isEdit ? <CreateVariants /> : <EditVariants product={product} />}
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
          form={nestedForm(form, "variants.0")}
        />
      )}
    </BodyCard>
  )
}

export default Variants
