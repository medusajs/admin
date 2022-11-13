import { ProductType } from "@medusajs/medusa"
import React from "react"
import MediaModal from "./media-modal"
import useToggleState from "../../../../hooks/use-toggle-state"
import { ActionType } from "../../../../components/molecules/actionables"
import Section from "../../../../components/organisms/section"

type Props = {
  product_type: ProductType
}

const MediaSection = ({ product_type }: Props) => {
  const { state, close, toggle } = useToggleState()

  const actions: ActionType[] = [
    {
      label: "Edit Media",
      onClick: toggle,
    },
  ]

  return (
    <>
      <Section title="Media" actions={actions}>
        {product_type.images && product_type.images.length > 0 && (
          <div className="grid grid-cols-3 gap-xsmall mt-base">
            {product_type.images.map((image, index) => {
              return (
                <div
                  key={image.id}
                  className="aspect-square flex items-center justify-center"
                >
                  <img
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    className="object-contain rounded-rounded max-w-full max-h-full"
                  />
                </div>
              )
            })}
          </div>
        )}
      </Section>

      <MediaModal product_type={product_type} open={state} onClose={close} />
    </>
  )
}

export default MediaSection
