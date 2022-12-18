import { NestedForm } from "../../../utils/nested-form"
import { PriceListPricesFormData } from "../types"

type Props = {
  form: NestedForm<PriceListPricesFormData>
}

const PriceListPricesForm = ({ form }: Props) => {
  const { control } = form

  return (
    <div>
      <div>list prices</div>
    </div>
  )
}

export default PriceListPricesForm
