import clsx from "clsx"
import React from "react"
import ThumbnailModal from "./thumbnail-modal"
import { ProductType } from "@medusajs/medusa"
import { getErrorMessage } from "../../../../utils/error-messages"
import useNotification from "../../../../hooks/use-notification"
import useToggleState from "../../../../hooks/use-toggle-state"
import Button from "../../../../components/fundamentals/button"
import TwoStepDelete from "../../../../components/atoms/two-step-delete"
import Section from "../../../../components/organisms/section"
import useEditTypeActions from "../hooks/use-edit-type-actions"

type Props = {
  product_type: ProductType
}

const TumbnailSection = ({ product_type }: Props) => {
  const { onUpdate, updating } = useEditTypeActions(product_type.id)
  const { state, toggle, close } = useToggleState()

  const notification = useNotification()

  const handleDelete = () => {
    onUpdate(
      {
        // @ts-ignore
        thumbnail: null,
      },
      {
        onSuccess: () => {
          notification("Success", "Successfully deleted thumbnail", "success")
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      }
    )
  }

  return (
    <>
      <Section
        title="Thumbnail"
        customActions={
          <div className="flex items-center gap-x-xsmall">
            <Button
              variant="secondary"
              size="small"
              type="button"
              onClick={toggle}
            >
              {product_type.thumbnail ? "Edit" : "Upload"}
            </Button>
            {product_type.thumbnail && (
              <TwoStepDelete onDelete={handleDelete} deleting={updating} />
            )}
          </div>
        }
      >
        <div
          className={clsx("grid grid-cols-3 gap-xsmall mt-base", {
            hidden: !product_type.thumbnail,
          })}
        >
          {product_type.thumbnail && (
            <div className="aspect-square flex items-center justify-center">
              <img
                src={product_type.thumbnail}
                alt={`Thumbnail for ${product_type.value}`}
                className="object-contain rounded-rounded max-w-full max-h-full"
              />
            </div>
          )}
        </div>
      </Section>

      <ThumbnailModal
        product_type={product_type}
        open={state}
        onClose={close}
      />
    </>
  )
}

export default TumbnailSection
