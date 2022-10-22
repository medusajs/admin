import React from "react"
import { ActionType } from "../../../../../components/molecules/actionables"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import MediaModal from "./media-modal"
import { useAdminCollection } from "medusa-react"
import Spinner from "../../../../../components/atoms/spinner"

const MediaSection = ({ location }) => {
  const { state, close, toggle } = useToggleState()
  const ensuredPath = location!.pathname.replace("/a/collections/", ``)
  const { collection } = useAdminCollection(ensuredPath)

  if (!collection) {
    return <Spinner />
  }

  const actions: ActionType[] = [
    {
      label: "Edit Media",
      onClick: toggle,
    },
  ]

  return (
    <>
      <Section title="Media" actions={actions}>
        {collection.images && collection.images.length > 0 && (
          <div className="grid grid-cols-3 gap-xsmall mt-base">
            {collection.images.map((image, index) => {
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

      <MediaModal collection={collection} open={state} onClose={close} />
    </>
  )
}

export default MediaSection
