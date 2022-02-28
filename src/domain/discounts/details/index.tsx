import { RouteComponentProps } from "@reach/router"
import { useAdminDeleteDiscount, useAdminDiscount } from "medusa-react"
import React, { useState } from "react"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import RawJSON from "../../../components/organisms/raw-json"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import DiscountForm from "../discount-form"
import { DiscountFormProvider } from "../discount-form/form/discount-form-context"
import { discountToFormValuesMapper } from "../discount-form/form/mappers"

type EditProps = {
  id: string
} & RouteComponentProps

const Edit: React.FC<EditProps> = ({ id }) => {
  const { discount, isLoading } = useAdminDiscount(id)
  const [showDelete, setShowDelete] = useState(false)
  const deleteDiscount = useAdminDeleteDiscount(id)
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
        <p>loading</p>
      ) : (
        <DiscountFormProvider
          discount={discountToFormValuesMapper(discount as any)} // suppressing type mismatch
          isEdit
        >
          <DiscountForm discount={discount} isEdit />
          <RawJSON data={discount} title="Raw discount" />
        </DiscountFormProvider>
      )}
    </div>
  )
}

export default Edit
