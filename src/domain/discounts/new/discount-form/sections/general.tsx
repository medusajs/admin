import { Discount } from "@medusajs/medusa"
import { useAdminRegions } from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { Controller, useWatch } from "react-hook-form"
import Checkbox from "../../../../../components/atoms/checkbox"
import IconTooltip from "../../../../../components/molecules/icon-tooltip"
import InputField from "../../../../../components/molecules/input"
import Select from "../../../../../components/molecules/select"
import Textarea from "../../../../../components/molecules/textarea"
import CurrencyInput from "../../../../../components/organisms/currency-input"
import { useDiscountForm } from "../form/discount-form-context"

type GeneralProps = {
  discount?: Discount
}

const General: React.FC<GeneralProps> = ({ discount }) => {
  const initialCurrency = discount?.regions?.[0].currency_code || undefined

  const [fixedRegionCurrency, setFixedRegionCurrency] = useState<
    string | undefined
  >(initialCurrency)

  const { regions: opts } = useAdminRegions()
  const { register, control, type } = useDiscountForm()

  const regions = useWatch({
    control,
    name: "regions",
  })

  useEffect(() => {
    if (type === "fixed" && regions) {
      let id: string

      if (Array.isArray(regions) && regions.length) {
        id = regions[0].value
      } else {
        id = ((regions as unknown) as { label: string; value: string }).value // if you change from fixed to percentage, unselect and select a region, and then change back to fixed it is possible to make useForm set regions to an object instead of an array
      }

      const reg = opts?.find((r) => r.id === id)

      if (reg) {
        setFixedRegionCurrency(reg.currency_code)
      }
    }
  }, [type, opts, regions])

  const regionOptions = useMemo(() => {
    return opts?.map((r) => ({ value: r.id, label: r.name })) || []
  }, [opts])

  const [render, setRender] = useState(false)
  useEffect(() => {
    setTimeout(() => setRender(true), 100)
  }, [])

  return (
    <div className="pt-5">
      {render && (
        <>
          <Controller
            name="regions"
            control={control}
            rules={{
              required: "Atleast one region is required",
              validate: (value) =>
                Array.isArray(value) ? value.length > 0 : !!value,
            }}
            render={({ onChange, value }) => {
              return (
                <Select
                  value={value || null}
                  onChange={(value) => {
                    onChange(type === "fixed" ? [value] : value)
                  }}
                  label="Choose valid regions"
                  isMultiSelect={type !== "fixed"}
                  hasSelectAll={type !== "fixed"}
                  enableSearch
                  required
                  options={regionOptions}
                />
              )
            }}
          />
          <div className="flex gap-x-base gap-y-base my-base">
            <InputField
              label="Code"
              className="flex-1"
              placeholder="SUMMERSALE10"
              required
              name="code"
              ref={register({ required: "Code is required" })}
            />

            {type !== "free_shipping" && (
              <>
                {type === "fixed" ? (
                  <div className="flex-1">
                    <CurrencyInput
                      size="small"
                      currentCurrency={fixedRegionCurrency}
                      readOnly
                      hideCurrency
                    >
                      <Controller
                        name="rule.value"
                        control={control}
                        rules={{
                          required: "Amount is required",
                          min: 1,
                        }}
                        render={({ value, onChange }) => {
                          return (
                            <CurrencyInput.AmountInput
                              label={"Amount"}
                              required
                              amount={value}
                              onChange={onChange}
                            />
                          )
                        }}
                      />
                    </CurrencyInput>
                  </div>
                ) : (
                  <div className="flex-1">
                    <InputField
                      label="Percentage"
                      min={0}
                      required
                      type="number"
                      placeholder="10"
                      prefix={"%"}
                      name="rule.value"
                      ref={register({
                        required: true,
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="text-grey-50 inter-small-regular flex flex-col mb-6">
            <span>
              The code your customers will enter during checkout. This will
              appear on your customer’s invoice.
            </span>
            <span>Uppercase letters and numbers only.</span>
          </div>
          <Textarea
            label="Description"
            required
            placeholder="Summer Sale 2022"
            rows={1}
            name="rule.description"
            ref={register({
              required: true,
            })}
          />
          <div className="mt-xlarge flex items-center">
            <Controller
              name="is_dynamic"
              control={control}
              render={({ onChange, value }) => {
                return (
                  <Checkbox
                    label="This is a template discount"
                    name="is_dynamic"
                    id="is_dynamic"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                  />
                )
              }}
            />
            <IconTooltip
              content={
                "Template discounts allow you to define a set of rules that can be used across a group of discounts. This is useful in campaigns that should generate unique codes for each user, but where the rules for all unique codes should be the same."
              }
            />
          </div>
        </>
      )}
    </div>
  )
}

export default General
