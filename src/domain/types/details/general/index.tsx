import React, { useState } from "react"
import Spinner from "../../../../components/atoms/spinner"
import Actionables from "../../../../components/molecules/actionables"
import ViewRaw from "../../../../components/molecules/view-raw"
import {
  useAdminDeleteProductType,
  useAdminUpdateProductType,
} from "medusa-react"
import TypeModal from "../../../../components/templates/type-modal"
import DeletePrompt from "../../../../components/organisms/delete-prompt"
import { navigate } from "gatsby"
import { MetadataField } from "../../../../components/organisms/metadata"
import { ProductType } from "@medusajs/medusa"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"

type Props = {
  product_type: ProductType
  isLoading: boolean
  refetch: () => void
  ensuredPath: string
}

const GeneralSection = ({
  product_type,
  isLoading,
  refetch,
  ensuredPath,
}: Props) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const deleteProductType = useAdminDeleteProductType(ensuredPath)
  const updateProductType = useAdminUpdateProductType(ensuredPath)

  const handleDelete = () => {
    deleteProductType.mutate(undefined, {
      onSuccess: () => navigate(`/a/types`),
    })
  }

  const handleUpdateDetails = (data: any, metadata: MetadataField[]) => {
    const payload: {
      value: string
      metadata?: object
    } = {
      value: data.value,
    }

    if (metadata) {
      const base = Object.keys(product_type?.metadata ?? {}).reduce(
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

    // @ts-ignore
    updateProductType.mutate(payload, {
      onSuccess: () => {
        setShowEdit(false)
        refetch()
      },
    })
  }

  return (
    <>
      <div className="rounded-rounded py-large px-xlarge border border-grey-20 bg-grey-0 mb-large">
        {isLoading || !product_type ? (
          <div className="flex items-center w-full h-12">
            <Spinner variant="secondary" size="large" />
          </div>
        ) : (
          <div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="inter-xlarge-semibold mb-2xsmall">
                  {product_type.value}
                </h2>
                <Actionables
                  forceDropdown
                  actions={[
                    {
                      label: "Edit Type",
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
            </div>

            {product_type.metadata && (
              <div className="mt-large flex flex-col gap-y-base">
                <h3 className="inter-base-semibold">Metadata</h3>
                <div>
                  <ViewRaw raw={product_type.metadata} name="metadata" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showEdit && (
        <TypeModal
          onClose={() => setShowEdit(!showEdit)}
          onSubmit={handleUpdateDetails}
          isEdit
          type={product_type}
        />
      )}
      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(!showDelete)}
          heading="Delete type"
          successText="Successfully deleted type"
          onDelete={async () => handleDelete()}
          confirmText="Yes, delete"
        />
      )}
    </>
  )
}

export default GeneralSection
