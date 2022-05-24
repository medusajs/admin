import { Discount } from "@medusajs/medusa"
import {
  useAdminDiscountRemoveCondition,
  useAdminUpdateDiscount,
} from "medusa-react"
import moment from "moment"
import { parse } from "postcss"
import React, { ReactNode } from "react"
import ClockIcon from "../../../components/fundamentals/icons/clock-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import { ActionType } from "../../../components/molecules/actionables"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { removeNullish } from "../../../utils/remove-nullish"

type displaySetting = {
  title: string
  description: ReactNode
  actions: ActionType[]
}

const DisplaySettingsDateDescription = ({ date }: { date: Date }) => (
  <div className="flex text-grey-50 inter-small-regular ">
    {moment(date).format("ddd, DD MMM YYYY")}
    <span className="flex items-center ml-3">
      <ClockIcon size={16} />
      <span className="ml-2.5">{moment(date).format("UTC HH:mm")}</span>
    </span>
  </div>
)

const CommonDescription = ({ text }) => (
  <span className="text-grey-50 inter-small-regular">{text}</span>
)

const getConditionSettings = (condition: any, openWithItems) => {
  switch (condition.type) {
    case "products":
      return {
        title: "Products",
        description: "This promotion only applies to specific products",
        actions: [
          {
            label: "Edit",
            icon: <EditIcon size={20} />,
            onClick: () => openWithItems(["conditions"]),
          },
        ],
      }
    case "product_types":
      return {
        title: "Type",
        description: "This promotion only applies to specific product types",
        actions: [
          {
            label: "Edit",
            icon: <EditIcon size={20} />,
            onClick: () => openWithItems(["conditions"]),
          },
        ],
      }
    case "product_collections":
      return {
        title: "Collection",
        description: "This promotion only applies to specific collections",
        actions: [
          {
            label: "Edit",
            icon: <EditIcon size={20} />,
            onClick: () => openWithItems(["conditions"]),
          },
        ],
      }
    case "product_tags":
      return {
        title: "Tag",
        description: "This promotion only applies to specific tags",
        actions: [
          {
            label: "Edit",
            icon: <EditIcon size={20} />,
            onClick: () => openWithItems(["conditions"]),
          },
        ],
      }
    case "customer_groups":
      return {
        title: "Customer group",
        description: "This promotion only applies to specific customer groups",
        actions: [
          {
            label: "Edit",
            icon: <EditIcon size={20} />,
            onClick: () => openWithItems(["conditions"]),
          },
        ],
      }
  }
  return null
}

const usePromotionSettings = (promotion: Discount, openWithItems) => {
  const updateDiscount = useAdminUpdateDiscount(promotion.id)
  const removeCondition = useAdminDiscountRemoveCondition(promotion.id)

  const notification = useNotification()

  const conditions: displaySetting[] = []

  conditions.push({
    title: "Regions",
    description: (
      <CommonDescription
        text={promotion.regions.map((r) => r.name).join(", ")}
      />
    ),
    actions: [
      {
        label: "Edit",
        icon: <EditIcon size={20} />,
        onClick: () => openWithItems(["general"]),
      },
    ],
  })

  conditions.push({
    title: "Start date",
    description: <DisplaySettingsDateDescription date={promotion.starts_at} />,
    actions: [
      {
        label: "Edit",
        icon: <EditIcon size={20} />,
        onClick: () => openWithItems(["configuration"]),
      },
    ],
  })

  if (promotion.ends_at) {
    conditions.push({
      title: "End date",
      description: <DisplaySettingsDateDescription date={promotion.ends_at} />,
      actions: [
        {
          label: "Edit",
          icon: <EditIcon size={20} />,
          onClick: () => openWithItems(["configuration"]),
        },
        {
          label: "Delete setting",
          icon: <TrashIcon size={20} />,
          variant: "danger",
          onClick: async () =>
            await updateDiscount.mutateAsync(
              { ends_at: null },
              {
                onSuccess: () => {
                  notification(
                    "Success",
                    "Discount end date removed",
                    "success"
                  )
                },
                onError: (error) => {
                  notification("Error", getErrorMessage(error), "error")
                },
              }
            ),
        },
      ],
    })
  }
  if (promotion.usage_limit) {
    conditions.push({
      title: "Number of redemptions",
      description: (
        <CommonDescription text={promotion.usage_limit.toLocaleString("en")} />
      ),
      actions: [
        {
          label: "Edit",
          icon: <EditIcon size={20} />,
          onClick: () => openWithItems(["configuration"]),
        },
        {
          label: "Delete setting",
          icon: <TrashIcon size={20} />,
          variant: "danger",
          onClick: async () =>
            await updateDiscount.mutateAsync(
              { usage_limit: null },
              {
                onSuccess: () => {
                  notification("Success", "Redemption limit removed", "success")
                },
                onError: (error) => {
                  notification("Error", getErrorMessage(error), "error")
                },
              }
            ),
        },
      ],
    })
  }
  if (promotion.valid_duration) {
    conditions.push({
      title: "Duration",
      description: (
        <CommonDescription
          text={Object.entries(removeNullish(parse(promotion.valid_duration)))
            .map(([key, value]) => `${value} ${key}`)
            .join(", ")}
        />
      ),
      actions: [
        {
          label: "Edit",
          icon: <EditIcon size={20} />,
          onClick: () => openWithItems(["configuration"]),
        },
        {
          label: "Delete setting",
          icon: <TrashIcon size={20} />,
          variant: "danger",
          onClick: async () =>
            await updateDiscount.mutateAsync(
              { valid_duration: null },
              {
                onSuccess: () => {
                  notification(
                    "Success",
                    "Discount duration removed",
                    "success"
                  )
                },
                onError: (error) => {
                  notification("Error", getErrorMessage(error), "error")
                },
              }
            ),
        },
      ],
    })
  }

  if (promotion.rule.conditions?.length) {
    const displaySettings = promotion.rule.conditions
      .map((condition) => {
        const setting = getConditionSettings(condition, openWithItems)
        if (setting) {
          return {
            ...setting,
            actions: [
              ...setting.actions,
              {
                label: "Delete setting",
                icon: <TrashIcon size={20} />,
                variant: "danger",
                onClick: async () =>
                  await removeCondition.mutateAsync(condition.id, {
                    onSuccess: () => {
                      notification(
                        "Success",
                        "Discount condition removed",
                        "success"
                      )
                    },
                    onError: (error) => {
                      notification("Error", getErrorMessage(error), "error")
                    },
                  }),
              },
            ],
          }
        }
      })
      .filter((s) => s !== null)
    conditions.push(...(displaySettings as displaySetting[]))
  }

  return conditions
}

export default usePromotionSettings
