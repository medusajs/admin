import React from "react"
import { UseFormReturn } from "react-hook-form"
import IconTooltip from "../../../../../components/molecules/icon-tooltip"
import Accordion from "../../../../../components/organisms/accordion"
import { nestedForm } from "../../../../../utils/nested-form"
import { PricesFormType } from "../../prices-form"
import VariantGeneralForm, {
  VariantGeneralFormType,
} from "../variant-general-form"
import VariantPricesForm from "../variant-prices-form"
import VariantSelectOptionsForm, {
  VariantOptionValueType,
  VariantSelectOptionsFormType,
} from "../variant-select-options-form"
import VariantShippingForm, {
  VariantShippingFormType,
} from "../variant-shipping-form"
import VariantStockForm, { VariantStockFormType } from "../variant-stock-form"

export type CreateFlowVariantFormType = {
  /**
   * Used to identify the variant during product create flow. Will not be submitted to the backend.
   */
  _internal_id?: string
  general: VariantGeneralFormType
  prices: PricesFormType
  stock: VariantStockFormType
  options: VariantSelectOptionsFormType
  shipping: VariantShippingFormType
}

type Props = {
  form: UseFormReturn<CreateFlowVariantFormType, any>
  options: VariantOptionValueType[]
  onCreateOption: (optionId: string, value: string) => void
}

/**
 * Re-usable Product Variant form used to add and edit product variants during the product create flow.
 * @example
 * const MyForm = () => {
 *   const form = useForm<CreateFlowVariantFormType>()
 *   const { handleSubmit } = form
 *
 *   const onSubmit = handleSubmit((data) => {
 *     // do something with data
 *   })
 *
 *   return (
 *     <form onSubmit={onSubmit}>
 *       <CreateFlowVariantForm form={form} />
 *       <Button type="submit">Submit</Button>
 *     </form>
 *   )
 * }
 */
const CreateFlowVariantForm = ({ form, options, onCreateOption }: Props) => {
  return (
    <Accordion type="multiple" defaultValue={["general"]}>
      <Accordion.Item title="General" value="general" required>
        <div>
          <VariantGeneralForm form={nestedForm(form, "general")} />
          <div className="mt-xlarge">
            <div className="flex items-center gap-x-2xsmall mb-base">
              <h3 className="inter-base-semibold">Options</h3>
              <IconTooltip
                type="info"
                content="Options are used to define the color, size, etc. of the variant."
              />
            </div>
            <VariantSelectOptionsForm
              form={nestedForm(form, "options")}
              options={options}
              onCreateOption={onCreateOption}
            />
          </div>
        </div>
      </Accordion.Item>
      <Accordion.Item title="Pricing" value="pricing">
        <VariantPricesForm form={nestedForm(form, "prices")} />
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

export default CreateFlowVariantForm
