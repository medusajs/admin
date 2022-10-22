import { RouteComponentProps } from "@reach/router"
import React from "react"
import BackButton from "../../../components/atoms/back-button"
import ThumbnailSection from "./sections/thumbnail"
import MediaSection from "./sections/media"
import BodyCardSection from "./sections/general/body-card"
import GeneralSection from "./sections/general/general-section"

const CollectionDetails: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <>
      <div className="flex flex-col h-full">
        <BackButton
          path="/a/products?view=collections"
          label="Back to Collections"
          className="mb-xsmall"
        />

        <div className="grid grid-cols-12 gap-x-base">
          <div className="col-span-8 flex flex-col gap-y-xsmall">
            <GeneralSection location={location} />
            <BodyCardSection location={location} />
          </div>

          <div className="flex flex-col col-span-4 gap-y-xsmall">
            <ThumbnailSection location={location} />
            <MediaSection location={location} />
          </div>
        </div>
      </div>
    </>
  )
}

export default CollectionDetails
