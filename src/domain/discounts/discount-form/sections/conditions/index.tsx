import { Discount } from "@medusajs/medusa"
import React, { useEffect, useState } from "react"
import Button from "../../../../../components/fundamentals/button"
import PlusIcon from "../../../../../components/fundamentals/icons/plus-icon"
import AddConditionsModal from "../../add-conditions-modal"
import { useDiscountForm } from "../../form/discount-form-context"
import ConditionItem from "./condition-item"

type ConditionsProps = {
  discount?: Discount
}

const Conditions: React.FC<ConditionsProps> = ({ discount }) => {
  const { setConditions, conditions } = useDiscountForm()
  const [showConditionsModal, setShowConditionsModal] = useState(false)

  useEffect(() => {
    if (discount?.rule?.conditions) {
      for (const condtion of discount.rule.conditions) {
        setConditions((prevCond) => ({
          ...prevCond,
          [condtion.type]: {
            ...conditions[condtion.type],
            id: condtion.id,
            operator: condtion.operator,
            type: condtion.type,
          },
        }))
      }
    }
  }, [discount?.rule?.conditions])

  return (
    <div className="pt-5">
      <div className="flex flex-col gap-y-small">
        {Object.values(conditions).map((values, i) => (
          <ConditionItem
            index={i}
            discountId={discount?.id}
            conditionId={values.id}
            type={values.type}
            updateCondition={setConditions}
            items={values.items}
          />
        ))}
      </div>
      <Button
        size="small"
        variant="ghost"
        onClick={() => setShowConditionsModal(true)}
        className="mt-4 p-2 w-full rounded-rounded border"
      >
        <PlusIcon size={18} />
        <span>Add Condition</span>
      </Button>
      {showConditionsModal && (
        <AddConditionsModal close={() => setShowConditionsModal(false)} />
      )}
    </div>
  )
}

export default Conditions
