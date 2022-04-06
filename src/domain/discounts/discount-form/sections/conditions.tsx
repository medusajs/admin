import React from "react"
import NumberedItem from "../../../../components/molecules/numbered-item"
import { useDiscountForm } from "../form/discount-form-context"
import useConditionActions from "./useConditionActions"

const Conditions = () => {
  const { conditions } = useDiscountForm()

  const { getActions } = useConditionActions()
  return (
    <div className="pt-6 flex flex-col gap-y-small">
      {Object.keys(conditions).map((key, i) => {
        return (
          conditions[key] && (
            <NumberedItem
              index={i + 1}
              title={getTitle(key)}
              actions={getActions(key)}
              description={
                <ConditionSetting
                  titles={conditions[key].map((c) => c.title)}
                />
              }
            />
          )
        )
      })}
    </div>
  )
}

const ConditionSetting = ({ titles }) => {
  const titleStrings = titles.reduce(
    (acc, cur) =>
      acc[1] + cur.length > 38 ? acc : [[...acc[0], cur], acc[1] + cur.length],
    [[], 0]
  )
  const description = titleStrings[0].join(", ")

  return (
    <span className="text-grey-50 inter-small-regular">
      {description}
      <span className="text-grey-40">
        {titles.length - titleStrings[0].length > 0 &&
          ` + ${titles.length - 2} more`}
      </span>
    </span>
  )
}

const getTitle = (type) => {
  switch (type) {
    case "products":
      return "Products"
    default:
      return "title"
  }
}

export default Conditions
