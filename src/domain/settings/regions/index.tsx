import { RouteComponentProps } from "@reach/router"
import React from "react"
import BackButton from "../../../components/atoms/back-button"
import EditRegion from "./edit"
import RegionOverview from "./region-overview"

type Props = RouteComponentProps

const Regions = (props: Props) => {
  const filepath: string | undefined = props["*"]

  return (
    <div className="flex flex-col gap-y-xsmall h-full">
      <BackButton label="Back to Settings" path="/a/settings" />
      <div className="grid grid-cols-1 medium:grid-cols-3 gap-xsmall pb-xlarge">
        <div className="w-full h-full">
          <RegionOverview id={filepath} />
        </div>
        <div className="col-span-2">
          <EditRegion id={filepath} />
        </div>
      </div>
    </div>
  )
}

export default Regions
