import { RouteComponentProps } from "@reach/router"
import { useAdminProduct } from "medusa-react"
import React from "react"
import AttributesSection from "./sections/attributes"
import GeneralSection from "./sections/general"
import VariantsSection from "./sections/variants"

interface EditProps extends RouteComponentProps {
  id?: string
}

const Edit = ({ id }: EditProps) => {
  const { product, status, error } = useAdminProduct(id || "")

  if (status === "error") {
    // temp
    return (
      <div>
        <pre>{JSON.stringify(error, null, 4)}</pre>
      </div>
    )
  }

  if (status === "loading" || !product) {
    // temp, perhaps use skeletons?
    return <div>Loading...</div>
  }

  return (
    <div>
      <div className="grid grid-col-12 gap-x-base">
        <div className="col-span-8 flex flex-col gap-y-xsmall">
          <GeneralSection product={product} />
          <VariantsSection product={product} />
          <AttributesSection product={product} />
        </div>
        <div className="col-span-4"></div>
      </div>
    </div>
  )
}

export default Edit
