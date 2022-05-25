import { Discount } from "@medusajs/medusa"
import React from "react"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import NumberedItem from "../../../components/molecules/numbered-item"
import BodyCard from "../../../components/organisms/body-card"
import usePromotionSettings from "./use-promotion-settings"

type PromotionSettingsProps = {
  promotion: Discount
  openWithItems: (openItems: string[]) => void
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

  const settings = usePromotionSettings(promotion, openWithItems)

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
            key={i}
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

export default PromotionSettings
