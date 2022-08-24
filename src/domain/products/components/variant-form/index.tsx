import React from "react"
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form"
import Switch from "../../../../components/atoms/switch"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import InputField from "../../../../components/molecules/input"
import Accordion from "../../../../components/organisms/accordion"
import FormValidator from "../../../../utils/form-validator"
import { nestedForm } from "../../../../utils/nested-form"
import CustomsForm, { CustomsPayload } from "../customs-form"
import DimensionsForm, { DimensionsPayload } from "../dimensions-form"
import PricesForm, { PricesPayload } from "../prices-form"

export type VariantFormType = {
  prices: PricesPayload
  manage_inventory: boolean
  allow_backorder: boolean
  title: string | null
  sku: string | null
  ean: string | null
  upc: string | null
  barcode: string | null
  options: {
    id: string
    value: string
    title: string
  }[]
  inventory_quantity: number | null
  material: string | null
  dimensions: DimensionsPayload
  customs: CustomsPayload
}

type Props = {
  form: UseFormReturn<VariantFormType, any>
}

/**
 * Re-usable Product Variant form used to add and edit product variants.
 * @example
 * const MyForm = () => {
 *   const form = useForm<VariantFormType>()
 *   const { handleSubmit } = form
 *
 *   const onSubmit = handleSubmit((data) => {
 *     // do something with data
 *   })
 *
 *   return (
 *     <form onSubmit={onSubmit}>
 *       <VariantForm form={form} />
 *       <Button type="submit">Submit</Button>
 *     </form>
 *   )
 * }
 */
const VariantForm = ({ form }: Props) => {
  const { fields } = useFieldArray({
    control: form.control,
    name: "options",
  })

  return (
    <Accordion type="multiple" defaultValue={["general"]}>
      <Accordion.Item title="General" value="general">
        <div>
          <p className="inter-base-regular text-grey-50">
            To start selling, all you need is a title, price, and image.
          </p>
          <div className="pt-large">
            <div className="grid grid-cols-2 gap-x-large">
              <InputField
                label="Custom title"
                placeholder="Green / XL..."
                {...form.register("title", {
                  pattern: FormValidator.whiteSpaceRule("Title"),
                })}
                errors={form.formState.errors}
              />
              <InputField
                label="Material"
                placeholder="80% wool, 20% cotton..."
                {...form.register("material", {
                  pattern: FormValidator.whiteSpaceRule("Material"),
                })}
                errors={form.formState.errors}
              />
            </div>
            <div className="mt-xlarge">
              <div className="flex items-center gap-x-2xsmall mb-base">
                <h3 className="inter-base-semibold">Options</h3>
                <IconTooltip
                  type="info"
                  content="Options are used to define the color, size, etc. of the variant."
                />
              </div>
              <div className="grid grid-cols-2 gap-large pb-2xsmall">
                {fields.map((field, index) => {
                  return (
                    <InputField
                      required
                      label={field.title}
                      {...form.register(`options.${index}.value`, {
                        required: `Option value for ${field.title} is required`,
                      })}
                      errors={form.formState.errors}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </Accordion.Item>
      <Accordion.Item title="Pricing" value="pricing">
        <div>
          <p className="inter-base-regular text-grey-50">
            To start selling, all you need is a title, price, and image.
          </p>
          <div className="pt-large">
            <PricesForm form={nestedForm(form, "prices")} />
          </div>
        </div>
      </Accordion.Item>
      <Accordion.Item title="Stock & Inventory" value="stock">
        <div>
          <p className="inter-base-regular text-grey-50">
            To start selling, all you need is a title, price, and image.
          </p>
          <div className="pt-large flex flex-col gap-y-xlarge">
            <div className="flex flex-col gap-y-2xsmall">
              <div className="flex items-center justify-between">
                <h3 className="inter-base-semibold mb-2xsmall">
                  Manage inventory
                </h3>
                <Controller
                  control={form.control}
                  name="manage_inventory"
                  render={({ field: { value, onChange } }) => {
                    return <Switch checked={value} onChange={onChange} />
                  }}
                />
              </div>
              <p className="inter-base-regular text-grey-50">
                When checked Medusa will regulate the inventory when orders and
                returns are made.
              </p>
            </div>
            <div className="flex flex-col gap-y-2xsmall">
              <div className="flex items-center justify-between">
                <h3 className="inter-base-semibold mb-2xsmall">
                  Allow backorders
                </h3>
                <Controller
                  control={form.control}
                  name="allow_backorder"
                  render={({ field: { value, onChange } }) => {
                    return <Switch checked={value} onChange={onChange} />
                  }}
                />
              </div>
              <p className="inter-base-regular text-grey-50">
                When checked the product will be available for purchase despite
                the product being sold out
              </p>
            </div>
            <div className="grid grid-cols-2 gap-large">
              <InputField
                label="Stock keeping unit (SKU)"
                placeholder="SUN-G, JK1234..."
                {...form.register("sku")}
              />
              <InputField
                label="Quantity in stock"
                type="number"
                placeholder="100..."
                {...form.register("inventory_quantity")}
              />
              <InputField
                label="EAN (Barcode)"
                placeholder="123456789102..."
                {...form.register("ean")}
              />
              <InputField
                label="UPC (Barcode)"
                placeholder="023456789104..."
                {...form.register("upc")}
              />
              <InputField
                label="Barcode"
                placeholder="123456789104..."
                {...form.register("barcode")}
              />
            </div>
          </div>
        </div>
      </Accordion.Item>
      <Accordion.Item title="Shipping" value="shipping">
        <p className="inter-base-regular text-grey-50">
          To start selling, all you need is a title, price, and image.
        </p>
        <div className="mt-large">
          <h3 className="inter-base-semibold mb-2xsmall">Dimensions</h3>
          <p className="inter-base-regular text-grey-50 mb-large">
            Configure to calculate the most accurate shipping rates
          </p>
          <DimensionsForm form={nestedForm(form, "dimensions")} />
        </div>
        <div className="mt-xlarge">
          <h3 className="inter-base-semibold mb-2xsmall">Customs</h3>
          <p className="inter-base-regular text-grey-50 mb-large">
            Configure to calculate the most accurate shipping rates
          </p>
          <CustomsForm form={nestedForm(form, "customs")} />
        </div>
      </Accordion.Item>
    </Accordion>
  )
}

export default VariantForm
