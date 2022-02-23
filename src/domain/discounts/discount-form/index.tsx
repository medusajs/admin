import * as React from "react"
import General from "./sections/general"

type DiscountFormProps = {
  discount?: any
  isEdit?: boolean
}

const DiscountForm: React.FC<DiscountFormProps> = ({
  discount,
  isEdit = false,
}) => {
  return (
    <div>
      <div>
        <General discount={discount} />
      </div>
    </div>
  )
}

export default DiscountForm
