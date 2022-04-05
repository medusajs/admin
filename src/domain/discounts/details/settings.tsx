import { Discount } from "@medusajs/medusa"
import moment from "moment"
import React, { ReactNode } from "react"
import ClockIcon from "../../../components/fundamentals/icons/clock-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import { ActionType } from "../../../components/molecules/actionables"
import NumberedItem from "../../../components/molecules/numbered-item"
import BodyCard from "../../../components/organisms/body-card"
import { parse } from "iso8601-duration"
import { removeNullish } from "../../../utils/remove-nullish"

type PromotionSettingsProps = {
  promotion: Discount
  openWithItems: (openItems: string[]) => void
}

type displaySetting = {
  title: string
  description: ReactNode
  actions: ActionType[]
}

const PromotionSettings: React.FC<PromotionSettingsProps> = ({
  promotion,
  openWithItems,
}) => {
  const actionables = [
    {
      label: "Edit",
      onClick: () => openWithItems([]),
      icon: <EditIcon size={20} />,
    },
    {
      label: "Remove all settings",
      onClick: () => console.log("rm all"),
      icon: <TrashIcon size={20} />,
      variant: "danger" as const,
    },
  ]

  const settings = getSettings(promotion, openWithItems)

  return (
    <BodyCard title={"Settings"} actionables={actionables}>
      <div
        style={{
          gridTemplateRows: `repeat(${Math.ceil(
            settings.length / 2
          )}, minmax(0, 1fr))`,
        }}
        className="grid grid-cols-2 grid-flow-col gap-y-base gap-x-xlarge"
      >
        {settings.map((setting, i) => (
          <NumberedItem
            title={setting.title}
            index={i + 1}
            description={setting.description}
            actions={setting.actions}
          />
        ))}
      </div>
    </BodyCard>
  )
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
  <span className="text-grey-50 inter-small-regular">
    {text}
    {text}
    {text}
    {text}
    {text}
    {text}
    {text}
    {text}
    {text}
    {text}
    {text}
    {text}
    {text}
    {text}
    {text}
    {text}
    {text}
    {text}
    {text}
  </span>
)

const getSettings = (promotion: Discount, openWithItems) => {
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
      ],
    })
  }

  if (promotion.rule.conditions?.length) {
    const displaySettings = promotion.rule.conditions
      .map((condition, i) => getConditionSettings(condition, openWithItems))
      .filter((s) => s !== null)
    conditions.push(...(displaySettings as displaySetting[]))
  }

  return conditions
}

const getConditionSettings = (condition: any, openWithItems) => {
  switch (condition.type) {
    case "products":
      return {
        title: "Products",
        description: "test",
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
        description: "test",
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
        description: "test",
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
        description: "test",
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
        description: "test",
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

export default PromotionSettings
