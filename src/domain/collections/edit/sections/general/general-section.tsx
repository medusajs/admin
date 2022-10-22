import React, { useState } from "react"
import Spinner from "../../../../../components/atoms/spinner"
import Actionables from "../../../../../components/molecules/actionables"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import ViewRaw from "../../../../../components/molecules/view-raw"
import {
  useAdminCollection,
  useAdminDeleteCollection,
  useAdminUpdateCollection,
} from "medusa-react"
import CollectionModal from "../../../../../components/templates/collection-modal"
import DeletePrompt from "../../../../../components/organisms/delete-prompt"
import { navigate } from "gatsby"
import { MetadataField } from "../../../../../components/organisms/metadata"

const GeneralSection = ({ location }) => {
  const ensuredPath = location!.pathname.replace("/a/collections/", ``)
  const { collection, isLoading, refetch } = useAdminCollection(ensuredPath)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const deleteCollection = useAdminDeleteCollection(ensuredPath)
  const updateCollection = useAdminUpdateCollection(ensuredPath)

  const handleDelete = () => {
    deleteCollection.mutate(undefined, {
      onSuccess: () => navigate(`/a/collections`),
    })
  }

  const handleUpdateDetails = (data: any, metadata: MetadataField[]) => {
    const payload: {
      title: string
      handle?: string
      description?: string
      metadata?: object
    } = {
      title: data.title,
      handle: data.handle,
      description: data.description,
    }

    if (metadata) {
      const base = Object.keys(collection?.metadata ?? {}).reduce(
        (acc, next) => ({ ...acc, [next]: null }),
        {}
      )

      payload.metadata = metadata.reduce((acc, next) => {
        return {
          ...acc,
          [next.key]: next.value ?? null,
        }
      }, base) // deleting metadata will not work as it's not supported by the core
    }

    updateCollection.mutate(payload, {
      onSuccess: () => {
        setShowEdit(false)
        refetch()
      },
    })
  }

  return (
    <>
      <div className="rounded-rounded py-large px-xlarge border border-grey-20 bg-grey-0 mb-large">
        {isLoading || !collection ? (
          <div className="flex items-center w-full h-12">
            <Spinner variant="secondary" size="large" />
          </div>
        ) : (
          <div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="inter-xlarge-semibold mb-2xsmall">
                  {collection.title}
                </h2>
                <Actionables
                  forceDropdown
                  actions={[
                    {
                      label: "Edit General Information",
                      onClick: () => setShowEdit(true),
                      icon: <EditIcon size="20" />,
                    },
                    {
                      label: "Delete",
                      onClick: () => setShowDelete(!showDelete),
                      variant: "danger",
                      icon: <TrashIcon size="20" />,
                    },
                  ]}
                />
              </div>
              <p className="inter-small-regular text-grey-50">
                Slug: /{collection.handle}
              </p>
              <p className="inter-small-regular text-grey-50 mt-1">
                Description: {collection.description}
              </p>
            </div>
            {collection.metadata && (
              <div className="mt-large flex flex-col gap-y-base">
                <h3 className="inter-base-semibold">Metadata</h3>
                <div>
                  <ViewRaw raw={collection.metadata} name="metadata" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showEdit && (
        <CollectionModal
          onClose={() => setShowEdit(!showEdit)}
          onSubmit={handleUpdateDetails}
          isEdit
          collection={collection}
        />
      )}
      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(!showDelete)}
          heading="Delete collection"
          successText="Successfully deleted collection"
          onDelete={async () => handleDelete()}
          confirmText="Yes, delete"
        />
      )}
    </>
  )
}

export default GeneralSection
