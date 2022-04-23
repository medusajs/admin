import { RouteComponentProps } from "@reach/router"
import { useAdminPriceList } from "medusa-react"
import * as React from "react"
import LoadingContainer from "../../../components/loading-container"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import RawJSON from "../../../components/organisms/raw-json"
import Header from "./sections/header"
import PricesDetails from "./sections/prices-details"

type PricingDetailsProps = RouteComponentProps & { id?: string }

const PricingDetails = ({ id }: PricingDetailsProps) => {
  const { price_list, isLoading } = useAdminPriceList(id)

  return (
    <div className="pb-xlarge">
      <Breadcrumb
        currentPage="Edit price list"
        previousBreadcrumb="Pricing"
        previousRoute="/a/pricing"
      />

      <LoadingContainer isLoading={isLoading || !price_list}>
        <Header priceList={price_list} />
        <div className="mt-4 w-full">
          <PricesDetails id={price_list?.id} />
        </div>
        <div className="mt-xlarge">
          <RawJSON data={price_list} title="Raw price list" />
        </div>
      </LoadingContainer>
    </div>
  )
}

export default PricingDetails
