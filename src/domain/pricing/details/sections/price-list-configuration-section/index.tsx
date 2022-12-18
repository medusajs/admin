import { PriceList } from "@medusajs/medusa"
import ClockIcon from "../../../../../components/fundamentals/icons/clock-icon"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import TaxesIcon from "../../../../../components/fundamentals/icons/taxes-icon"
import UsersIcon from "../../../../../components/fundamentals/icons/users-icon"
import { ActionType } from "../../../../../components/molecules/actionables"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import PriceListConfigurationCard from "./price-list-configuration-card"
import PriceListConfigurationModal from "./price-list-configuration-modal"

type Props = {
  priceList: PriceList
}

const PriceListConfigurationSection = ({ priceList }: Props) => {
  const { state, toggle, close } = useToggleState()

  const actions: ActionType[] = [
    {
      label: "Edit configuration",
      onClick: toggle,
      icon: <EditIcon size={20} />,
    },
  ]

  return (
    <>
      <Section title="Configurations" actions={actions} forceDropdown>
        <div className="grid gap-x-xlarge gap-y-small grid-cols-2 pt-large">
          {priceList.starts_at && (
            <PriceListConfigurationCard
              icon={<ClockIcon size="20" />}
              label="Starts at"
              value={new Date(priceList.starts_at)}
            />
          )}
          {priceList.ends_at && (
            <PriceListConfigurationCard
              icon={<ClockIcon size="20" />}
              label="Ends at"
              value={new Date(new Date().toUTCString())}
            />
          )}
          <PriceListConfigurationCard
            icon={<UsersIcon size="20" />}
            label="Customer groups"
            value={
              priceList.customer_groups.length
                ? priceList.customer_groups[0].name
                : "Applies to all customers"
            }
          />
          <PriceListConfigurationCard
            icon={<TaxesIcon size="20" />}
            label="Tax inclusive"
            value={
              priceList.includes_tax
                ? "Prices include taxes"
                : "Prices do not include taxes"
            }
          />
        </div>
      </Section>
      <PriceListConfigurationModal
        priceList={priceList}
        open={state}
        onClose={close}
      />
    </>
  )
}

export default PriceListConfigurationSection
