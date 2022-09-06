import { RouteComponentProps } from "@reach/router"
import React from "react"
import BackButton from "../../../components/atoms/back-button"
import TwoSplitPane from "../../../components/templates/two-split-pane"
import EditRegion from "./edit"
import RegionOverview from "./region-overview"

type Props = RouteComponentProps

const RegionsRoute = (props: Props) => {
  const filepath: string | undefined = props["*"]

  return (
    <div className="flex flex-col gap-y-xsmall h-full">
      <BackButton label="Back to Settings" path="/a/settings" />
      <TwoSplitPane threeCols className="h-full">
        <RegionOverview />
        <EditRegion id={filepath} />
      </TwoSplitPane>
    </div>
  )
}

export default RegionsRoute
