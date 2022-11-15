import clsx from "clsx"
import React from "react"
import TwoStepDelete from "../../../../../components/atoms/two-step-delete"
import Button from "../../../../../components/fundamentals/button"
import Section from "../../../../../components/organisms/section"
import useNotification from "../../../../../hooks/use-notification"
import useToggleState from "../../../../../hooks/use-toggle-state"
import { getErrorMessage } from "../../../../../utils/error-messages"
import useEditProductCollectionActions from "../../hooks/use-edit-product-collection-actions"
import ThumbnailModal from "./thumbnail-modal"
import { useAdminCollection } from "medusa-react"
import Spinner from "../../../../../components/atoms/spinner"

const ThumbnailSection = ({ location }) => {
  const ensuredPath = location!.pathname.replace("/a/collections/", ``)
  const { collection } = useAdminCollection(ensuredPath)
  const { state, toggle, close } = useToggleState()
  const notification = useNotification()

  const { onUpdate, updating } = useEditProductCollectionActions(
    collection?.id || ""
  )

  if (!collection) {
    return <Spinner />
  }

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
              {collection.thumbnail ? "Edit" : "Upload"}
            </Button>
            {collection.thumbnail && (
              <TwoStepDelete onDelete={handleDelete} deleting={updating} />
            )}
          </div>
        }
      >
        <div
          className={clsx("grid grid-cols-3 gap-xsmall mt-base", {
            hidden: !collection.thumbnail,
          })}
        >
          {collection.thumbnail && (
            <div className="aspect-square flex items-center justify-center">
              <img
                src={collection.thumbnail}
                alt={`Thumbnail for ${collection.title}`}
                className="object-contain rounded-rounded max-w-full max-h-full"
              />
            </div>
          )}
        </div>
      </Section>

      <ThumbnailModal collection={collection} open={state} onClose={close} />
    </>
  )
}

export default ThumbnailSection
