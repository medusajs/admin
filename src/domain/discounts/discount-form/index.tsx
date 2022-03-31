import * as React from "react"
import General from "./sections/general"
import Settings from "./sections/settings"

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
        <General discount={discount} isEdit={isEdit} />
      </div>
      <div className="mt-xlarge">
        <Settings isEdit={isEdit} />
      </div>
    </div>
  )
}

export default DiscountForm
