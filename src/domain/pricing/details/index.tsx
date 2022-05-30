import { RouteComponentProps } from "@reach/router"
import { useAdminPriceList } from "medusa-react"
import * as React from "react"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import RawJSON from "../../../components/organisms/raw-json"
import { mapPriceListToFormValues } from "../pricing-form/form/mappers"
import { PriceListFormProvider } from "../pricing-form/form/pricing-form-context"
import Header from "./sections/header"
import PricesDetails from "./sections/prices-details"

type PricingDetailsProps = RouteComponentProps & { id?: string }

const PricingDetails = ({ id }: PricingDetailsProps) => {
  const { price_list, isLoading } = useAdminPriceList(id!)

  return (
    <div className="pb-xlarge">
      <Breadcrumb
        currentPage="Edit price list"
        previousBreadcrumb="Pricing"
        previousRoute="/a/pricing"
      />

      {!isLoading && price_list ? (
        <PriceListFormProvider priceList={mapPriceListToFormValues(price_list)}>
          <Header priceList={price_list} />
          <div className="mt-4 w-full">
            <PricesDetails id={price_list?.id} />
          </div>
          <div className="mt-xlarge">
            <RawJSON data={price_list} title="Raw price list" />
          </div>
        </PriceListFormProvider>
      ) : null}
    </div>
  )
}

export default PricingDetails
