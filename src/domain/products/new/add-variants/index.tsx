import clsx from "clsx"
import React, { useCallback, useEffect } from "react"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import InputField from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import TagInput from "../../../../components/molecules/tag-input"
import useToggleState from "../../../../hooks/use-toggle-state"
import { NestedForm } from "../../../../utils/nested-form"
import VariantForm, { VariantFormType } from "../../components/variant-form"
import NewVariant from "./new-variant"

type ProductOptionType = {
  title: string
  values: string[]
}

export type AddVariantsFormType = {
  options: ProductOptionType[]
  entries: VariantFormType[]
}

type Props = {
  form: NestedForm<AddVariantsFormType>
}

const AddVariantsForm = ({ form }: Props) => {
  const { control, path, register } = form

  const {
    fields: options,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: path("options"),
    shouldUnregister: true,
  })

  const {
    fields: variants,
    append: appendVariant,
    remove: removeVariant,
    update: updateVariant,
    move: moveVariant,
  } = useFieldArray({
    control,
    name: path("entries"),
    shouldUnregister: true,
  })

  const watchedOptions = useWatch({
    control,
    name: path("options"),
  })

  const watchedEntries = useWatch({
    control,
    name: path("entries"),
  })

  useEffect(() => {
    if (watchedOptions?.length) {
    }
  }, [watchedOptions, watchedEntries])

  const appendNewOption = () => {
    appendOption({
      title: "",
      values: [],
    })
  }

  const newVariantForm = useForm<VariantFormType>()
  const { reset, handleSubmit: submitVariant } = newVariantForm
  const { state, toggle } = useToggleState()

  const onToggleForm = () => {
    reset(createEmptyVariant(watchedOptions))
    toggle()
  }

  const onAppendVariant = submitVariant((data) => {
    appendVariant({
      ...data,
      title: data.title
        ? data.title
        : data.options.map((option) => option.value).join(" / "),
    })
    onToggleForm()
  })

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    moveVariant(dragIndex, hoverIndex)
  }, [])

  return (
    <>
      <div>
        <div className="flex items-center gap-x-2xsmall">
          <h3 className="inter-base-semibold">Product options</h3>
          <IconTooltip
            type="info"
            content="Options are used to define the color, size, etc. of the product."
          />
        </div>
        <div>
          {options.length > 0 && (
            <div className="mt-small">
              <div className="grid grid-cols-[230px_1fr_40px] gap-x-xsmall inter-small-semibold text-grey-50 mb-small">
                <span>Option title</span>
                <span>Variations (comma separated)</span>
              </div>
              <div className="grid grid-cols-1 gap-y-xsmall">
                {options.map((field, index) => {
                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-[230px_1fr_40px] gap-x-xsmall"
                    >
                      <InputField
                        key={field.id}
                        placeholder="Color..."
                        {...register(path(`options.${index}.title`))}
                      />
                      <Controller
                        control={control}
                        name={path(`options.${index}.values`)}
                        render={({ field: { value, onChange } }) => {
                          return (
                            <TagInput
                              key={field.id}
                              onValidate={(newVal) => {
                                if (value.includes(newVal)) {
                                  return null
                                }

                                return newVal
                              }}
                              invalidMessage="already exists"
                              showLabel={false}
                              values={value}
                              onChange={onChange}
                              placeholder="Blue, Red, Black..."
                            />
                          )
                        }}
                      />
                      <Button
                        variant="secondary"
                        size="small"
                        type="button"
                        className="h-10"
                        onClick={() => removeOption(index)}
                      >
                        <TrashIcon size={20} className="text-grey-40" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          <Button
            variant="secondary"
            size="small"
            className="h-10 w-full mt-base"
            type="button"
            onClick={appendNewOption}
          >
            <PlusIcon size={20} />
            <span>Add an option</span>
          </Button>
          <div className="mt-xlarge">
            <div className="flex items-center gap-x-2xsmall">
              <h3
                className={clsx("inter-base-semibold", {
                  "opacity-50": !options.length,
                })}
              >
                Product variants{" "}
                <span className="inter-base-regular text-grey-50">
                  ({variants?.length || 0})
                </span>
              </h3>
              {!options?.length && (
                <IconTooltip
                  type="warning"
                  content="Add product options to begin creating variants."
                />
              )}
            </div>
            {variants?.length > 0 && (
              <div className="mt-small">
                <div className="grid grid-cols-[1fr_90px_100px_48px] inter-small-semibold text-grey-50 pr-base">
                  <p>Variant</p>
                  <div className="flex justify-end mr-xlarge">
                    <p>Inventory</p>
                  </div>
                </div>
                <div>
                  {variants?.map((variant, index) => {
                    return (
                      <NewVariant
                        key={variant.id}
                        id={variant.id}
                        source={variant}
                        index={index}
                        save={updateVariant}
                        move={moveCard}
                      />
                    )
                  })}
                </div>
              </div>
            )}
            <Button
              variant="secondary"
              size="small"
              className="h-10 w-full mt-base"
              type="button"
              disabled={!options.length}
              onClick={onToggleForm}
            >
              <PlusIcon size={20} />
              <span>Add a variant</span>
            </Button>
          </div>
        </div>
      </div>

      <Modal open={state} handleClose={onToggleForm}>
        <Modal.Body>
          <Modal.Header handleClose={onToggleForm}>
            <h1 className="inter-xlarge-semibold">Create Variant</h1>
          </Modal.Header>
          <Modal.Content>
            <VariantForm form={newVariantForm} />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center gap-x-xsmall justify-end w-full">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={onToggleForm}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                type="button"
                onClick={onAppendVariant}
              >
                Save and close
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
}

const createEmptyVariant = (options: ProductOptionType[]) => {
  return {
    title: null,
    prices: {
      prices: [],
    },
    manage_inventory: true,
    allow_backorder: false,
    dimensions: {
      weight: null,
      length: null,
      width: null,
      height: null,
    },
    sku: null,
    barcode: null,
    customs: {
      hs_code: null,
      mid_code: null,
      origin_country: null,
    },
    ean: null,
    upc: null,
    inventory_quantity: null,
    material: null,
    options: options.map((option) => ({
      title: option.title,
      value: "",
      id: "null",
    })),
  }
}

export default AddVariantsForm
