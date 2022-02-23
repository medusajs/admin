import React from "react"
import ReactJson from "react-json-view"

import BodyCard from "../body-card"

type RawJSONProps = {
  data?: object
  title: string
}

function RawJSON(props: RawJSONProps) {
  const { title, data } = props

  if (!data) {
    return null
  }

  return (
    <BodyCard className={"w-full mb-4 min-h-0 h-auto"} title={title}>
      <div className="flex flex-col min-h-[100px] mt-4 bg-grey-5 px-3 py-2 h-full rounded-rounded">
        <span className="inter-base-semibold">
          Data <span className="text-grey-50 inter-base-regular">(1 item)</span>
        </span>
        <div className="flex flex-grow items-center mt-4">
          <ReactJson name={false} collapsed={true} src={data} />
        </div>
      </div>
    </BodyCard>
  )
}

export default RawJSON
