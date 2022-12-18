import { PriceList } from "@medusajs/medusa"
import { ReactNode, useMemo } from "react"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import StatusIndicator from "../../../../../components/fundamentals/status-indicator"
import { ActionType } from "../../../../../components/molecules/actionables"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import { PriceListStatus } from "../../../types"
import PriceListGeneralModal from "./price-list-general-modal"

type Props = {
  priceList: PriceList
}

const PriceListGeneralSection = ({ priceList }: Props) => {
  const { state, open, close } = useToggleState()

  const actions: ActionType[] = [
    {
      label: "Edit general info",
      onClick: open,
      icon: <EditIcon />,
    },
    {
      label: "Delete price list",
      onClick: () => {},
      icon: <TrashIcon />,
      variant: "danger",
    },
  ]

  return (
    <>
      <Section
        title={priceList.name}
        actions={actions}
        status={<PriceListStatusIndicator {...priceList} />}
      >
        <div className="flex flex-col gap-y-large mt-2xsmall">
          <p className="inter-small-regular text-grey-50">
            {priceList.description}
          </p>
          <div className="flex items-center gap-x-12">
            <HighlightedAttribute
              label="Price overrides"
              attr={priceList.prices.length}
            />
            <HighlightedAttribute
              label="Last edited"
              attr={new Date(priceList.updated_at).toLocaleDateString(
                undefined,
                {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            />
          </div>
        </div>
      </Section>
      <PriceListGeneralModal
        priceList={priceList}
        open={state}
        onClose={close}
      />
    </>
  )
}

const HighlightedAttribute = ({
  label,
  attr,
}: {
  label: string
  attr: string | ReactNode
}) => {
  const Component = typeof attr === "string" ? "p" : "div"

  return (
    <div className="border-l border-grey-20 pl-large">
      <Component className="inter-xlarge-regular">{attr}</Component>
      <span className="inter-small-regular text-grey-40">{label}</span>
    </div>
  )
}

const PriceListStatusIndicator = ({
  status,
  ends_at,
  starts_at,
}: {
  status: PriceListStatus
  ends_at: Date | null
  starts_at: Date | null
}) => {
  const curr: {
    label: string
    color: "default" | "warning" | "danger" | "active"
  } = useMemo(() => {
    if (status === PriceListStatus.DRAFT) {
      return { label: "Draft", color: "default" }
    }

    const isPast = (date: Date | null) => {
      const now = new Date()
      return date && new Date(date) < now
    }

    const isFuture = (date: Date | null) => {
      const now = new Date()
      return date && new Date(date) > now
    }

    if (isFuture(starts_at)) {
      return { label: "Scheduled", color: "warning" }
    }

    if (isPast(ends_at)) {
      return { label: "Expired", color: "danger" }
    }

    return { label: "Active", color: "active" }
  }, [status, starts_at, ends_at])

  return (
    <div className="flex items-center gap-x-xsmall px-small py-1.5">
      <StatusIndicator variant={curr.color} />
      <span className="inter-small-regular">{curr.label}</span>
    </div>
  )
}

export default PriceListGeneralSection
