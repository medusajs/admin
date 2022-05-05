import { Discount } from "@medusajs/medusa"
import { RouteComponentProps } from "@reach/router"
import { navigate } from "gatsby"
import { useAdminUpdateDiscount } from "medusa-react"
import { useAdminDeleteDiscount, useAdminDiscount } from "medusa-react"
import React, { useState } from "react"
import Fade from "../../../components/atoms/fade-wrapper"
import Spinner from "../../../components/atoms/spinner"
import Badge from "../../../components/fundamentals/badge"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
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
import {
  discountToFormValuesMapper,
  ExtendedDiscount,
} from "../discount-form/form/mappers"
import PromotionSettings from "./settings"

type EditProps = {
  id: string
} & RouteComponentProps

const Edit: React.FC<EditProps> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false)
  const adminDiscountResp = useAdminDiscount(id)
  const { isLoading } = adminDiscountResp
  const discount = adminDiscountResp.discount as ExtendedDiscount
  const [showDelete, setShowDelete] = useState(false)
  const deleteDiscount = useAdminDeleteDiscount(id)
  const notification = useNotification()
  const [openItems, setOpenItems] = useState<string[]>([])

  const openWithItems = (items: string[]) => {
    setOpenItems(items)
    setIsOpen(true)
  }

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
        <>
          <HeadingBodyCard
            promotion={discount}
            id={id}
            setIsOpen={setIsOpen}
            title={discount.code}
            subtitle={discount.rule.description}
          >
            <div className="flex flex-wrap">
              <div className="border-l border-grey-20 pl-6">
                {getPromotionDescription(discount)}
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
              {discount.is_recurring && (
                <p className="mt-4 w-full">
                  This is a <b>recurring</b> promotion.
                </p>
              )}
            </div>
          </HeadingBodyCard>
          <div className="mt-4 w-full">
            <PromotionSettings
              promotion={discount}
              openWithItems={openWithItems}
            />
          </div>
        </>
      )}
      <div className="mt-xlarge">
        <RawJSON data={discount} title="Raw discount" />
      </div>
      {!isLoading && discount && (
        <DiscountFormProvider
          discount={discountToFormValuesMapper(discount as any)} // suppressing type mismatch
          isEdit
        >
          <Fade isVisible={isOpen} isFullScreen={true}>
            <DiscountForm
              additionalOpen={openItems}
              closeForm={() => {
                setOpenItems([])
                setIsOpen(false)
              }}
              discount={discount}
              isEdit
            />
          </Fade>
        </DiscountFormProvider>
      )}
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
          </h2>
          <span className="inter-base-regular text-grey-50 ml-1">
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

const HeadingBodyCard = ({ id, promotion, setIsOpen, ...props }) => {
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
          notification("Success", "Promotion deleted successfully", "success")
          navigate("/a/discounts/")
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
      label: "Edit Promotion",
      onClick: () => setIsOpen(true),
      icon: <EditIcon />,
    },
    {
      label: "Delete Promotion",
      onClick: onDelete,
      variant: "danger" as const,
      icon: <TrashIcon />,
    },
  ]

  return (
    <BodyCard
      actionables={actionables}
      forceDropdown
      className="min-h-[200px]"
      status={
        <div className="flex items-center gap-x-2xsmall">
          {promotion.is_dynamic && (
            <span>
              <Badge variant="default">
                <span className="text-grey-90 inter-small-regular">
                  {"Template discount"}
                </span>
              </Badge>
            </span>
          )}
          <StatusSelector
            isDraft={promotion?.is_disabled}
            activeState="Published"
            draftState="Draft"
            onChange={onStatusChange}
          />
        </div>
      }
      {...props}
    />
  )
}

export default Edit
