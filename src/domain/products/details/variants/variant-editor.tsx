import { useAdminStore } from "medusa-react"
import React, { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import Checkbox from "../../../../components/atoms/checkbox"
import Button from "../../../../components/fundamentals/button"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import InfoTooltip from "../../../../components/molecules/info-tooltip"
import Input from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import Select from "../../../../components/molecules/select"
import CurrencyInput from "../../../../components/organisms/currency-input"
import Metadata from "../../../../components/organisms/metadata"
import { convertEmptyStringToNull } from "../../../../utils/convert-empty-string-to-null"
import { countries as countryData } from "../../../../utils/countries"
import { removeNullish } from "../../../../utils/remove-nullish"

const defaultVariant = {
  prices: [] as any,
  origin_country: "",
  options: [] as any,
  metadata: {} as any,
}

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

  const { store, isLoading } = useAdminStore()
  const [currencyOptions, setCurrencyOptions] = useState<
    {
      value: any
      label: string
    }[]
  >([])
  const [prices, setPrices] = useState(variant?.prices)
  const [selectedCountry, setSelectedCountry] = useState(() => {
    const defaultCountry = variant.origin_country
      ? countryOptions.find((cd) => cd.label === variant.origin_country)
      : null
    return defaultCountry || null
  })

  const [metadata, setMetadata] = useState(
    Object.keys(variant.metadata).map((key) => ({
      key,
      value: variant.metadata[key],
    }))
  )

  const { control, register, reset, watch, handleSubmit } = useForm({
    defaultValues: variant,
  })

  const { fields } = useFieldArray({
    control,
    name: "options",
    keyName: "indexId",
  })

  useEffect(() => {
    reset({
      ...variant,
      options: Object.values(optionsMap),
    })
  }, [variant])

  useEffect(() => {
    register(`metadata`)
    setValue(`metadata`, metadata)
  }, [metadata])

  const getCurrencyOptions = () => {
    return ((store && store.currencies) || [])
      .map((v) => ({
        value: v.code.toUpperCase(),
        label: v.code.toUpperCase(),
      }))
      .filter(
        (o) => !prices.find((p) => !p.edit && p.currency_code === o.value)
      )
  }

  useEffect(() => {
    setCurrencyOptions(getCurrencyOptions())
  }, [store, isLoading, variant.prices])

  const handleCurrencySelected = (index, currency) => {
    const newPrices = [...prices]
    newPrices[index] = {
      ...newPrices[index],
      currency_code: currency.toLowerCase(),
    }

    setPrices(newPrices)
  }

  const handlePriceChange = (index, value) => {
    const newPrices = [...prices]
    newPrices[index] = {
      ...newPrices[index],
      amount: value,
    }

    setPrices(newPrices)
  }

  const removePrice = (index) => {
    const newPrices = [...prices]
    newPrices.splice(index, 1)
    setPrices(newPrices)
  }

  const addPrice = () => {
    const newPrices = [
      ...prices,
      {
        edit: true,
        region: "",
        currency_code: currencyOptions[0].value,
        amount: "",
        sale_amount: "",
      },
    ]

    setPrices(newPrices)
  }

  const handleSave = (data) => {
    data.prices = prices.map(({ currency_code, region_id, amount }) => ({
      currency_code,
      region_id,
      amount: Math.round(amount),
    }))
    data.options = data.options.map((option) => ({ ...option }))

    data.origin_country = selectedCountry?.label
    data.inventory_quantity = parseInt(data.inventory_quantity)
    data.weight = data?.weight ? parseInt(data.weight, 10) : undefined
    data.height = data?.height ? parseInt(data.height, 10) : undefined
    data.width = data?.width ? parseInt(data.width, 10) : undefined
    data.length = data?.length ? parseInt(data.length, 10) : undefined

    data.prices = data.prices.map((p) => removeNullish(p))

    const emptyMetadata = Object.keys(variant.metadata).reduce(
      (acc, key) => ({ ...acc, [key]: null }),
      {}
    )
    data.metadata = data.metadata.reduce((acc, { key, value }) => {
      acc[key] = value
      return acc
    }, emptyMetadata)

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
              <Input label="Title" name="title" ref={register} />
              {fields.map((field, index) => (
                <div key={field.indexId}>
                  <Input
                    ref={register({ required: true })}
                    name={`options[${index}].value`}
                    label={field.title}
                    defaultValue={field.value}
                  />
                  <input
                    ref={register()}
                    type="hidden"
                    name={`options[${index}].option_id`}
                    defaultValue={field.option_id}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <label
              tabIndex={0}
              className="inter-base-semibold mb-4 flex items-center gap-xsmall"
            >
              {"Prices"}
              <InfoTooltip content={"Variant prices"} />
            </label>

            <div className="grid grid-cols-1 gap-y-xsmall">
              {prices.map((p, index) => (
                <div
                  className="flex items-center"
                  key={`${p.currency_code}${index}`}
                >
                  <div className="w-full">
                    <CurrencyInput
                      currencyCodes={currencyOptions.map((co) => co.value)}
                      currentCurrency={p.currency_code.toUpperCase()}
                      onChange={(currency) =>
                        handleCurrencySelected(index, currency)
                      }
                      size="small"
                    >
                      <CurrencyInput.AmountInput
                        label="Amount"
                        step={0.01}
                        amount={p.amount}
                        onChange={(value) => handlePriceChange(index, value)}
                      />
                    </CurrencyInput>
                  </div>

                  <Button
                    variant="ghost"
                    size="small"
                    className="ml-8 w-8 h-8 mr-2.5 text-grey-40 hover:text-grey-80 transition-colors"
                    onClick={() => removePrice(index)}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              ))}
            </div>
            {currencyOptions.length !== prices.length && (
              <Button
                className="mt-4"
                onClick={addPrice}
                size="small"
                variant="ghost"
              >
                <PlusIcon size={20} /> Add a price
              </Button>
            )}
          </div>
          <div className="mb-8">
            <label className="inter-base-semibold flex items-center gap-xsmall">
              {"Stock & Inventory"}
              <InfoTooltip content={"Stock and inventory information"} />
            </label>
            <div className="w-full mt-4 grid medium:grid-cols-2 grid-cols-1 gap-y-base gap-x-xsmall">
              <Input label="SKU" name="sku" placeholder="SKU" ref={register} />
              <Input label="EAN" name="ean" placeholder="EAN" ref={register} />
              <Input
                label="Inventory quantity"
                name="inventory_quantity"
                placeholder="100"
                type="number"
                ref={register}
              />

              <Input
                label="UPC Barcode"
                name="barcode"
                placeholder="Barcode"
                ref={register}
              />
            </div>

            <div className="flex items-center mt-6 gap-x-large">
              <div className="flex item-center gap-x-1.5">
                <Checkbox
                  name="manage_inventory"
                  label="Manage Inventory"
                  ref={register}
                />
                <InfoTooltip
                  content={
                    "When checked Medusa will regulate the inventory when orders and returns are made."
                  }
                />
              </div>
              <div className="flex item-center gap-x-1.5">
                <Checkbox
                  name="allow_backorder"
                  ref={register}
                  label="Allow backorders"
                />
                <InfoTooltip
                  content={
                    "When checked the product will be available for purchase despite the product being sold out."
                  }
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="inter-base-semibold flex items-center gap-xsmall">
              Dimensions <InfoTooltip content={"Variant dimensions"} />
            </label>
            <div className="w-full mt-4 grid medium:grid-cols-2 grid-cols-1 gap-y-base gap-x-xsmall">
              <Input
                label="Height"
                placeholder="Product Height"
                name="height"
                ref={register}
              />
              <Input
                label="Width"
                placeholder="Product Width"
                name="width"
                ref={register}
              />
              <Input
                label="Length"
                name="length"
                placeholder="Product Length"
                ref={register}
              />
              <Input
                label="Weight"
                name="weight"
                placeholder="Product Weight"
                ref={register}
              />
            </div>
          </div>
          <div className="mb-8">
            <label className="inter-base-semibold flex items-center gap-xsmall">
              Customs <InfoTooltip content={"Variant customs information"} />
            </label>
            <div className="w-full grid mt-4 medium:grid-cols-2 grid-cols-1 gap-y-base gap-x-xsmall">
              <Input
                label="MID Code"
                placeholder="MID Code"
                name="mid_code"
                ref={register}
              />
              <Input
                label="HS Code"
                placeholder="HS Code"
                name="hs_code"
                ref={register}
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
                name="material"
                placeholder="Material"
                ref={register}
              />
            </div>
          </div>
          <Metadata metadata={metadata} setMetadata={setMetadata} />
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
