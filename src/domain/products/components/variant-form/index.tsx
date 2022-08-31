import React from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import InputField from "../../../../components/molecules/input"
import Accordion from "../../../../components/organisms/accordion"
import FormValidator from "../../../../utils/form-validator"
import { nestedForm } from "../../../../utils/nested-form"
import PricesForm, { PricesPayload } from "../prices-form"
import VariantShippingForm, {
  VariantShippingFormType,
} from "./variant-shipping-form"
import VariantStockForm, { VariantStockFormType } from "./variant-stock-form"

export type VariantFormType = {
  /**
   * Used to identify the variant during product create flow. Will not be submitted to the backend.
   */
  _internal_id?: string
  title: string | null
  material: string | null
  prices: PricesPayload
  stock: VariantStockFormType
  options: {
    option_id: string
    label: string
    value: string
    title: string
  }[]
  shipping: VariantShippingFormType
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
      <Accordion.Item title="General" value="general" required>
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
        <VariantStockForm form={nestedForm(form, "stock")} />
      </Accordion.Item>
      <Accordion.Item title="Shipping" value="shipping">
        <VariantShippingForm form={nestedForm(form, "shipping")} />
      </Accordion.Item>
    </Accordion>
  )
}

export default VariantForm
