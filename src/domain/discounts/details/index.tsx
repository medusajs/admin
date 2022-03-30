import { Discount } from "@medusajs/medusa"
import { RouteComponentProps } from "@reach/router"
import { navigate } from "gatsby"
import { useAdminUpdateDiscount } from "medusa-react"
import { useAdminDeleteDiscount, useAdminDiscount } from "medusa-react"
import React, { useState } from "react"
import Spinner from "../../../components/atoms/spinner"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import StatusIndicator from "../../../components/fundamentals/status-indicator"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import StatusSelector from "../../../components/molecules/status-selector"
import BodyCard from "../../../components/organisms/body-card"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import RawJSON from "../../../components/organisms/raw-json"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { formatAmountWithSymbol } from "../../../utils/prices"
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
        <div className="h-full flex items-center justify-center">
          <Spinner variant="secondary" />
        </div>
      ) : (
        <HeadingBodyCard
          promotion={discount}
          id={id}
          title={discount.code}
          subtitle={discount.rule.description}
        >
          <div className="flex">
            <div className="border-l border-grey-20 pl-6">
              {getPromotionDescription(discount)}
              {/* <h2 className="inter-xlarge-regular text-grey-90">
                {discount.usage_count}
              </h2> */}
              <span className="inter-small-regular text-grey-50">
                {"Discount Amount"}
              </span>
            </div>
            <div className="border-l border-grey-20 pl-6 ml-12">
              <h2 className="inter-xlarge-regular text-grey-90">
                {discount.usage_count.toLocaleString("en-US")}
              </h2>
              <span className="inter-small-regular text-grey-50">
                {"Total Redemptions"}
              </span>
            </div>
          </div>
        </HeadingBodyCard>
        // <DiscountFormProvider
        //   discount={discountToFormValuesMapper(discount as any)} // suppressing type mismatch
        //   isEdit
        // >
        //   <DiscountForm discount={discount} isEdit />
        // </DiscountFormProvider>
      )}
      <div className="mt-xlarge">
        <RawJSON data={discount} title="Raw discount" />
      </div>
    </div>
  )
}

const getPromotionDescription = (discount: Discount) => {
  switch (discount.rule.type) {
    case "fixed":
      return (
        <div className="flex items-baseline">
          <h2 className="inter-xlarge-regular">
            {formatAmountWithSymbol({
              currency: discount.regions[0].currency_code,
              amount: discount.rule.value,
            })}
            {/* <span className="text-grey-50">kr.</span>
            {discount.rule.value} */}
          </h2>
          <span className="inter-base-regular text-grey-50">
            {discount.regions[0].currency_code.toUpperCase()}
          </span>
        </div>
      )
    case "percentage":
      return (
        <div className="flex items-baseline">
          <h2 className="inter-xlarge-regular text-grey-90">
            {discount.rule.value}
          </h2>
          <span className="inter-base-regular text-grey-50 ml-1">%</span>
        </div>
      )
    case "free_shipping":
      return (
        <h2 className="inter-xlarge-regular text-grey-90">{`FREE SHIPPING`}</h2>
      )
    default:
      return "Unknown discount type"
  }
}

const HeadingBodyCard = ({ id, promotion, ...props }) => {
  const dialog = useImperativeDialog()
  const notification = useNotification()
  const updatePromotion = useAdminUpdateDiscount(id)
  const deletePromotion = useAdminDeleteDiscount(id)

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Promotion",
      text: "Are you sure you want to delete this promotion?",
    })
    if (shouldDelete) {
      deletePromotion.mutate(undefined, {
        onSuccess: () => {
          notification("Success", "Product deleted successfully", "success")
          navigate("/a/products/")
        },
        onError: (err) => {
          notification("Ooops", getErrorMessage(err), "error")
        },
      })
    }
  }

  const onStatusChange = async () => {
    updatePromotion.mutate(
      {
        is_disabled: !promotion.is_disabled,
      },
      {
        onSuccess: () => {
          const pastTense = !promotion.is_disabled ? "published" : "drafted"
          notification(
            "Success",
            `Promotion ${pastTense} successfully`,
            "success"
          )
        },
        onError: (err) => {
          notification("Ooops", getErrorMessage(err), "error")
        },
      }
    )
  }

  const actionables = [
    {
      label: "Delete Product",
      onClick: onDelete,
      icon: <EditIcon />,
    },
    {
      label: "Delete Product",
      onClick: onDelete,
      variant: "danger" as const,
      icon: <TrashIcon />,
    },
  ]

  return (
    <BodyCard
      actionables={actionables}
      forceDropdown
      status={
        <StatusSelector
          isDraft={promotion?.is_disabled}
          activeState="Published"
          draftState="Draft"
          onChange={onStatusChange}
        />
      }
      {...props}
    />
  )
}

export default Edit
