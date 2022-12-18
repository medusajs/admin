import { useAdminPriceList } from "medusa-react"
import { useParams } from "react-router-dom"
import BackButton from "../../../components/atoms/back-button"
import {
  PriceListConfigurationSection,
  PriceListGeneralSection,
  PriceListPricesSection,
} from "./sections"

const PriceListDetails = () => {
  const { id = "" } = useParams<{ id: string }>()
  const { price_list, status } = useAdminPriceList(id, {
    enabled: id.length > 0,
  })

  if (status === "loading") {
    return <p>Loading...</p>
  }

  return (
    <div>
      <BackButton
        label="Back to Pricing"
        path="/a/pricing"
        className="mb-xsmall"
      />
      <div className="flex flex-col gap-y-base">
        <PriceListGeneralSection priceList={price_list!} />
        <PriceListConfigurationSection priceList={price_list!} />
        <PriceListPricesSection priceListId={price_list?.id!} />
      </div>
    </div>
  )
}

export default PriceListDetails
