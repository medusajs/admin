import { useAdminStore } from "medusa-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import InfoTooltip from "../../../../components/molecules/info-tooltip"
import Input from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import Select from "../../../../components/molecules/select"
import CurrencyInput from "../../../../components/organisms/currency-input"
import { convertEmptyStringToNull } from "../../../../utils/convert-empty-string-to-null"
import { countries as countryData } from "../../../../utils/countries"
import { removeNullish } from "../../../../utils/remove-nullish"

const VariantEditor = ({ variant, onSubmit, onCancel }) => {
  const countryOptions = countryData.map((c) => ({
    label: c.name,
    value: c.alpha2.toLowerCase(),
  }))

  const { store, isLoading } = useAdminStore()
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [prices, setPrices] = useState(variant.prices)
  const [selectedCountry, setSelectedCountry] = useState(
    variant.origin_country
      ? countryOptions.find((cd) => cd.label === variant.origin_country)
      : undefined
  )

  const { setValue, getValues, register, reset, watch, handleSubmit } = useForm(
    variant
  )

  useEffect(() => {
    reset({
      ...variant,
    })

    variant.options.forEach((option, index) => {
      register(`options.${index}.option_id`)
      setValue(`options.${index}.option_id`, option.option_id)
      register(`options.${index}.value`)
      setValue(`options.${index}.value`, option.value)
    })
  }, [variant])

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

    data.origin_country = selectedCountry?.label
    data.inventory_quantity = parseInt(data.inventory_quantity)

    data.prices = data.prices.map((p) => removeNullish(p))
    const cleaned = convertEmptyStringToNull(data)
    onSubmit(cleaned)
  }

  watch(["manage_inventory", "allow_backorder"])

  const variantTitle = variant.options
    .map((opt) => opt?.value || "")
    .join(" / ")

  return (
    <Modal handleClose={onCancel}>
      <Modal.Body>
        <Modal.Header handleClose={onCancel}>
          <h2 className="inter-xlarge-semibold">
            Edit Variant{" "}
            <span className="text-grey-50 inter-xlarge-regular">
              ({variantTitle})
            </span>
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

            <div className="grid grid-cols-1 ">
              <Input label="Title" name="title" ref={register} />
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
                        label="amount"
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
                placeholder="Inventory quantity"
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

            <div className="flex mt-6 gap-x-large">
              <div
                className="cursor-pointer flex items-center"
                onClick={(e) => {
                  setValue("manage_inventory", !getValues("manage_inventory"), {
                    shouldDirty: true,
                  })
                }}
              >
                <div
                  className={`w-5 h-5 mr-3 flex justify-center text-grey-0 border-grey-30 border rounded-base ${
                    getValues("manage_inventory") && "bg-violet-60"
                  }`}
                >
                  <span className="self-center">
                    {getValues("manage_inventory") && <CheckIcon size={16} />}
                  </span>
                </div>
                <input
                  className="hidden"
                  type="checkbox"
                  ref={register}
                  name="manage_inventory"
                />
                <span className="mr-1">Manage Inventory</span>
                <InfoTooltip content={"Manage inventory for variant"} />
              </div>
              <div
                className="cursor-pointer flex items-center"
                onClick={(e) => {
                  setValue("allow_backorder", !getValues("allow_backorder"), {
                    shouldDirty: true,
                  })
                }}
              >
                <div
                  className={`w-5 h-5 mr-3 flex justify-center text-grey-0 border-grey-30 border rounded-base ${
                    getValues("allow_backorder") && "bg-violet-60"
                  }`}
                >
                  <span className="self-center">
                    {getValues("allow_backorder") && <CheckIcon size={16} />}
                  </span>
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  ref={register}
                  name="allow_backorder"
                />
                <span className="mr-1">Allow backorders</span>
                <InfoTooltip content={"Allow backorders for variant"} />
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
