import clsx from "clsx"
import { uniqueId } from "lodash"
import React, { useCallback, useEffect } from "react"
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import InputField from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import TagInput from "../../../../components/molecules/tag-input"
import { useDebounce } from "../../../../hooks/use-debounce"
import useToggleState from "../../../../hooks/use-toggle-state"
import { NestedForm } from "../../../../utils/nested-form"
import VariantForm, { VariantFormType } from "../../components/variant-form"
import NewVariant from "./new-variant"

type ProductOptionType = {
  id: string
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
    keyName: "fieldId",
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

  const debouncedOptions = useDebounce(watchedOptions, 500)

  useEffect(() => {
    if (debouncedOptions?.length) {
      const optionMap = debouncedOptions.reduce((acc, option) => {
        acc[option.id] = option
        return acc
      }, {} as Record<string, ProductOptionType>)

      console.log("optionMap built", optionMap)

      const indexedVars = watchedEntries?.map((variant, index) => ({
        variant,
        index,
      }))

      if (indexedVars) {
        indexedVars.forEach((indexedVar) => {
          const { variant, index } = indexedVar

          const options = variant.options
          const validOptions = [] as {
            id: string
            title: string
            value: string
          }[]

          options.forEach((option) => {
            const { id } = option
            const optionData = optionMap[id]

            console.log(`Result for lookup of option with ${id}`, optionData)

            if (optionData) {
              option.title = optionData.title

              if (!optionData.values.includes(option.value)) {
                option.value = ""
              }

              validOptions.push(option)
            }
          })

          const validIds = validOptions.map((option) => option.id)
          const missingIds = Object.keys(optionMap).filter(
            (id) => !validIds.includes(id)
          )

          missingIds.forEach((id) => {
            const optionData = optionMap[id]
            validOptions.push({
              id,
              title: optionData.title,
              value: "",
            })
          })

          console.log(
            `Updating variant ${index} with new options`,
            validOptions
          )

          updateVariant(index, {
            ...variant,
            options: validOptions,
          })
        })
      }
    }
  }, [debouncedOptions])

  const appendNewOption = () => {
    appendOption({
      id: uniqueId("opt_"),
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
                      key={field.fieldId}
                      className="grid grid-cols-[230px_1fr_40px] gap-x-xsmall"
                    >
                      <InputField
                        placeholder="Color..."
                        {...register(path(`options.${index}.title`))}
                      />
                      <Controller
                        control={control}
                        name={path(`options.${index}.values`)}
                        render={({ field: { value, onChange } }) => {
                          return (
                            <TagInput
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
      id: option.id,
    })),
  }
}

export default AddVariantsForm
