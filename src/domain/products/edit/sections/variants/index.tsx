import { Product } from "@medusajs/medusa"
import { useAdminProducts } from "medusa-react"
import React from "react"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import GearIcon from "../../../../../components/fundamentals/icons/gear-icon"
import PlusIcon from "../../../../../components/fundamentals/icons/plus-icon"
import { ActionType } from "../../../../../components/molecules/actionables"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import OptionsModal from "./options-modal"
import VariantsTable from "./table"

type Props = {
  product: Product
}

const VariantsSection = ({ product }: Props) => {
  const {
    state: optionState,
    close: closeOptions,
    toggle: toggleOptions,
  } = useToggleState()

  const actions: ActionType[] = [
    {
      label: "Add Variant",
      onClick: () => {},
      icon: <PlusIcon size="20" />,
    },
    {
      label: "Edit Variants",
      onClick: () => {},
      icon: <EditIcon size="20" />,
    },
    {
      label: "Edit Options",
      onClick: toggleOptions,
      icon: <GearIcon size="20" />,
    },
  ]

  return (
    <>
      <Section title="Variants" actions={actions}>
        <ProductOptions product={product} />
        <div className="mt-xlarge">
          <h2 className="inter-large-semibold mb-base">
            Product variants{" "}
            <span className="inter-large-regular text-grey-50">
              ({product.variants.length})
            </span>
          </h2>
          <VariantsTable variants={product.variants} />
        </div>
      </Section>
      <OptionsModal
        product={product}
        open={optionState}
        onClose={closeOptions}
      />
    </>
  )
}

const ProductOptions = ({ product }: Props) => {
  const { products, status } = useAdminProducts({
    id: product.id,
    expand: "options,options.values",
  })

  const source = products?.[0] as Product | undefined

  if (status === "error") {
    return null
  }

  if (status === "loading" || !source) {
    return (
      <div className="mt-base grid grid-cols-3 gap-x-8">
        {Array.from(Array(2)).map((_, i) => {
          return (
            <div key={i}>
              <div className="bg-grey-30 h-6 w-9 animate-pulse mb-xsmall"></div>
              <ul className="flex items-center gap-x-1">
                {Array.from(Array(3)).map((_, j) => (
                  <li key={j}>
                    <div className="text-grey-50 bg-grey-10 h-8 w-12 animate-pulse rounded-rounded">
                      {j}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="mt-base grid grid-cols-3 gap-x-8">
      {source.options.map((option) => {
        return (
          <div key={option.id}>
            <h3 className="inter-base-semibold mb-xsmall">{option.title}</h3>
            <ul className="flex items-center gap-x-1">
              {option.values?.map((v) => (
                <li key={v.id}>
                  <div className="text-grey-50 bg-grey-10 inter-small-semibold px-3 py-[6px] rounded-rounded">
                    {v.value}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default VariantsSection
