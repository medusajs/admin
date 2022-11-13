import { ProductType } from "@medusajs/medusa"
import React from "react"
import ReactJson from "react-json-view"
import Section from "../../../../components/organisms/section"

type Props = {
  product_type: ProductType
}

/** Temporary component, should be replaced with <RawJson /> but since the design is different we will use this to not break the existing design across admin. */
const RawSection = ({ product_type }: Props) => {
  return (
    <Section title="Raw Type">
      <div className="mt-base bg-grey-5 rounded-rounded px-base py-xsmall">
        <ReactJson name={false} collapsed={true} src={product_type} />
      </div>
    </Section>
  )
}

export default RawSection
