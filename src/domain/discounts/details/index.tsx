import { RouteComponentProps } from "@reach/router"
import { useAdminDeleteDiscount, useAdminDiscount } from "medusa-react"
import React, { useState } from "react"
import Spinner from "../../../components/atoms/spinner"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import RawJSON from "../../../components/organisms/raw-json"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import Conditions from "./conditions"
import Configurations from "./configurations"
import General from "./general"

const Edit: React.FC<RouteComponentProps<{ id: string }>> = ({ id }) => {
  const { discount, isLoading } = useAdminDiscount(id!, undefined, {
    enabled: !!id,
  })
  const [showDelete, setShowDelete] = useState(false)
  const deleteDiscount = useAdminDeleteDiscount(id!)
  const notification = useNotification()

  const handleDelete = () => {
    deleteDiscount.mutate(undefined, {
      onSuccess: () => {
        notification("Success", "Discount deleted", "success")
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <div className="pb-xlarge">
      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(!showDelete)}
          onDelete={async () => handleDelete()}
          successText="Discount deleted"
          confirmText="Yes, delete"
          text="Are you sure you want to delete this discount?"
          heading="Delete discount"
        />
      )}

      <Breadcrumb
        currentPage="Add Discount"
        previousBreadcrumb="Discount"
        previousRoute="/a/discounts"
      />
      {isLoading || !discount ? (
        <div className="h-full flex items-center justify-center">
          <Spinner variant="secondary" />
        </div>
      ) : (
        <div className="flex flex-col gap-y-4">
          <General discount={discount} />
          <Configurations discount={discount} />
          <Conditions discount={discount} />
          <RawJSON data={discount} title="Raw discount" />
        </div>
      )}
    </div>
  )
}

export default Edit
