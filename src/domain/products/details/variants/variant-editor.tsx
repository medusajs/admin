import { useAdminStore } from "medusa-react"
import React, { useEffect, useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import Checkbox from "../../../../components/atoms/checkbox"
import Button from "../../../../components/fundamentals/button"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Input from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import Select from "../../../../components/molecules/select"
import CurrencyInput from "../../../../components/organisms/currency-input"
import { convertEmptyStringToNull } from "../../../../utils/convert-empty-string-to-null"
import { countries as countryData } from "../../../../utils/countries"
import { focusByName } from "../../../../utils/focus-by-name"
import usePricesFieldArray from "../../product-form/form/use-prices-field-array"

const defaultVariant = {
  prices: [] as any,
  origin_country: "",
  options: [] as any,
}

type VariantEditorFormData = {}

const VariantEditor = ({
  variant = defaultVariant,
  onSubmit,
  onCancel,
  title,
  optionsMap,
}) => {
  const countryOptions = countryData.map((c) => ({
    label: c.name,
    value: c.alpha2.toLowerCase(),
  }))

  const { store } = useAdminStore()
  const [selectedCountry, setSelectedCountry] = useState(() => {
    const defaultCountry = variant.origin_country
      ? countryOptions.find((cd) => cd.label === variant.origin_country)
      : null
    return defaultCountry || null
  })

  const { control, register, reset, watch, handleSubmit } = useForm({
    defaultValues: variant,
  })

  const {
    fields: prices,
    appendPrice,
    deletePrice,
    availableCurrencies,
  } = usePricesFieldArray(
    store?.currencies.map((c) => c.code) || [],
    {
      control,
      name: "prices",
      keyName: "indexId",
    },
    {
      defaultAmount: 1000,
      defaultCurrencyCode:
        store?.default_currency.code || store?.currencies[0].code || "usd",
    }
  )

  const { fields } = useFieldArray({
    control,
    name: "options",
    keyName: "indexId",
  })

  useEffect(() => {
    reset({
      ...variant,
      options: Object.values(optionsMap),
      prices: variant?.prices.map((p) => ({
        price: { ...p },
      })),
    })
  }, [variant, store])

  const handleSave = (data) => {
    if (!data.prices) {
      focusByName("add-price")
      return
    }

    if (!data.title) {
      data.title = data.options.map((o) => o.value).join(" / ")
    }

    data.prices = data.prices.map(({ price: { currency_code, amount } }) => ({
      currency_code,
      amount: Math.round(amount),
    }))
    data.options = data.options.map((option) => ({ ...option }))

    data.origin_country = selectedCountry?.label
    data.inventory_quantity = parseInt(data.inventory_quantity)
    data.weight = data?.weight ? parseInt(data.weight, 10) : undefined
    data.height = data?.height ? parseInt(data.height, 10) : undefined
    data.width = data?.width ? parseInt(data.width, 10) : undefined
    data.length = data?.length ? parseInt(data.length, 10) : undefined

    const cleaned = convertEmptyStringToNull(data)
    onSubmit(cleaned)
  }

  watch(["manage_inventory", "allow_backorder"])

  const variantTitle = variant?.options
    .map((opt) => opt?.value || "")
    .join(" / ")

  return (
    <Modal handleClose={onCancel}>
      <Modal.Body>
        <Modal.Header handleClose={onCancel}>
          <h2 className="inter-xlarge-semibold">
            {title}{" "}
            {variantTitle && (
              <span className="text-grey-50 inter-xlarge-regular">
                ({variantTitle})
              </span>
            )}
          </h2>
        </Modal.Header>
        <Modal.Content>
          <div className="mb-8">
            <label
              tabIndex={0}
              className="inter-base-semibold mb-4 flex items-center gap-xsmall"
            >
              {"General"}
            </label>

            <div className="grid grid-cols-1 gap-y-small">
              <Input label="Title" {...register("title")} />
              {fields.map((field, index) => (
                <div key={field.indexId}>
                  <Input
                    {...register(`options.${index}.value`, { required: true })}
                    required={true}
                    label={field.title}
                    defaultValue={field.value}
                  />
                  <input
                    type="hidden"
                    {...register(`options.${index}.option_id`)}
                    defaultValue={field.option_id}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <label
              tabIndex={0}
              className="inter-base-semibold mb-4 flex items-center"
            >
              {"Prices"}
              <span className="text-rose-50 mr-xsmall">*</span>
              <IconTooltip content={"Variant prices"} />
            </label>

            <div className="grid grid-cols-1 gap-y-xsmall">
              {prices.map((field, index) => (
                <div className="flex items-center" key={field.indexId}>
                  <div className="w-full">
                    <Controller
                      control={control}
                      key={field.indexId}
                      name={`prices.${index}.price`}
                      render={({ field: { onChange, value } }) => {
                        let codes = availableCurrencies
                        if (value?.currency_code) {
                          codes = [value?.currency_code, ...availableCurrencies]
                        }
                        codes.sort()
                        return (
                          <CurrencyInput.Root
                            currencyCodes={codes}
                            currentCurrency={value?.currency_code}
                            size="medium"
                            readOnly={index === 0}
                            onChange={(code) =>
                              onChange({ ...value, currency_code: code })
                            }
                          >
                            <CurrencyInput.Amount
                              label="Amount"
                              onChange={(amount) =>
                                onChange({ ...value, amount })
                              }
                              amount={value?.amount}
                            />
                          </CurrencyInput.Root>
                        )
                      }}
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="small"
                    className="ml-8 w-8 h-8 mr-2.5 text-grey-40 hover:text-grey-80 transition-colors"
                    onClick={deletePrice(index)}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              className="mt-4"
              onClick={appendPrice}
              size="small"
              variant="ghost"
              name="add-price"
              disabled={availableCurrencies?.length === 0}
            >
              <PlusIcon size={20} /> Add a price
            </Button>
          </div>
          <div className="mb-8">
            <label className="inter-base-semibold flex items-center gap-xsmall">
              {"Stock & Inventory"}
              <IconTooltip content={"Stock and inventory information"} />
            </label>
            <div className="w-full mt-4 grid medium:grid-cols-2 grid-cols-1 gap-y-base gap-x-xsmall">
              <Input label="SKU" {...register("sku")} placeholder="SKU" />
              <Input label="EAN" {...register("ean")} placeholder="EAN" />
              <Input
                label="Inventory quantity"
                {...register("inventory_quantity")}
                placeholder="100"
                type="number"
              />

              <Input
                label="UPC Barcode"
                {...register("barcode")}
                placeholder="Barcode"
              />
            </div>

            <div className="flex items-center mt-6 gap-x-large">
              <div className="flex item-center gap-x-1.5">
                <Checkbox
                  {...register("manage_inventory")}
                  label="Manage Inventory"
                />
                <IconTooltip
                  content={
                    "When checked Medusa will regulate the inventory when orders and returns are made."
                  }
                />
              </div>
              <div className="flex item-center gap-x-1.5">
                <Checkbox
                  {...register("allow_backorder")}
                  label="Allow backorders"
                />
                <IconTooltip
                  content={
                    "When checked the product will be available for purchase despite the product being sold out."
                  }
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="inter-base-semibold flex items-center gap-xsmall">
              Dimensions <IconTooltip content={"Variant dimensions"} />
            </label>
            <div className="w-full mt-4 grid medium:grid-cols-2 grid-cols-1 gap-y-base gap-x-xsmall">
              <Input
                label="Height"
                placeholder="Product Height"
                {...register("height")}
              />
              <Input
                label="Width"
                placeholder="Product Width"
                {...register("width")}
              />
              <Input
                label="Length"
                {...register("length")}
                placeholder="Product Length"
              />
              <Input
                label="Weight"
                {...register("weight")}
                placeholder="Product Weight"
              />
            </div>
          </div>
          <div className="mb-8">
            <label className="inter-base-semibold flex items-center gap-xsmall">
              Customs <IconTooltip content={"Variant customs information"} />
            </label>
            <div className="w-full grid mt-4 medium:grid-cols-2 grid-cols-1 gap-y-base gap-x-xsmall">
              <Input
                label="MID Code"
                placeholder="MID Code"
                {...register("mid_code")}
              />
              <Input
                label="HS Code"
                placeholder="HS Code"
                {...register("hs_code")}
              />
              <Select
                enableSearch
                label={"Country of origin"}
                options={countryOptions}
                value={selectedCountry}
                onChange={setSelectedCountry}
              />
              <Input
                label="Material"
                {...register("material")}
                placeholder="Material"
              />
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end gap-x-base">
            <Button
              className="w-[127px]"
              onClick={onCancel}
              size="small"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(handleSave)}
              type="submit"
              className="w-[127px]"
              size="small"
              variant="primary"
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default VariantEditor
