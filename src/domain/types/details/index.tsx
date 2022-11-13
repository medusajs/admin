import { RouteComponentProps } from "@reach/router"
import { useAdminProductType } from "medusa-react"
import React from "react"
import BackButton from "../../../components/atoms/back-button"
import GeneralSection from "./general"
import RawSection from "./raw"
import ThumbnailSection from "./thumbnail"
import MediaSection from "./media"
import Spinner from "../../../components/atoms/spinner"

const TypeDetails: React.FC<RouteComponentProps> = ({ location }) => {
  const ensuredPath = location!.pathname.replace("/a/types/", ``)
  const { product_type, isLoading, refetch } = useAdminProductType(ensuredPath)

  if (!product_type) {
    return <Spinner />
  }

  return (
    <div className="pb-5xlarge">
      <BackButton
        path="/a/products?view=types"
        label="Back to Types"
        className="mb-xsmall"
      />
      <div className="grid grid-cols-12 gap-x-base">
        <div className="col-span-8 flex flex-col gap-y-xsmall">
          <GeneralSection
            product_type={product_type}
            isLoading={isLoading}
            refetch={refetch}
            ensuredPath={ensuredPath}
          />
          <RawSection product_type={product_type} />
        </div>
        <div className="flex flex-col col-span-4 gap-y-xsmall">
          <ThumbnailSection product_type={product_type} />
          <MediaSection product_type={product_type} />
        </div>
      </div>
    </div>
  )
}

export default TypeDetails
