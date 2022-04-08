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
import PromotionForm from "../promotion-form"
import { PromotionFormProvider } from "../promotion-form/form/promotion-form-context"
import { promotionToFormValuesMapper } from "../promotion-form/form/mappers"
import PromotionSettings from "./settings"
import { Discount } from "@medusajs/medusa"

type EditProps = {
  id: string
} & RouteComponentProps

const Edit: React.FC<EditProps> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { discount: promotion, isLoading } = useAdminDiscount(id)
  const [showDelete, setShowDelete] = useState(false)
  const deletePromotion = useAdminDeleteDiscount(id)
  const notification = useNotification()
  const [openItems, setOpenItems] = useState<string[]>([])

  const openWithItems = (items: string[]) => {
    setOpenItems(items)
    setIsOpen(true)
  }

  const handleDelete = () => {
    deletePromotion.mutate(undefined, {
      onSuccess: () => {
        notification("Success", "Promotion deleted", "success")
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
          successText="Promotion deleted"
          confirmText="Yes, delete"
          text="Are you sure you want to delete this promotion?"
          heading="Delete promotion"
        />
      )}

      <Breadcrumb
        currentPage="Add Promotion"
        previousBreadcrumb="Promotion"
        previousRoute="/a/discounts"
      />
      {isLoading || !promotion ? (
        <div className="h-full flex items-center justify-center">
          <Spinner variant="secondary" />
        </div>
      ) : (
        <>
          <HeadingBodyCard
            promotion={promotion}
            id={id}
            setIsOpen={setIsOpen}
            title={promotion.code}
            subtitle={promotion.rule.description}
          >
            <div className="flex">
              <div className="border-l border-grey-20 pl-6">
                {getPromotionDescription(promotion)}
                <span className="inter-small-regular text-grey-50">
                  {"Promotion Amount"}
                </span>
              </div>
              <div className="border-l border-grey-20 pl-6 ml-12">
                <h2 className="inter-xlarge-regular text-grey-90">
                  {promotion.usage_count.toLocaleString("en-US")}
                </h2>
                <span className="inter-small-regular text-grey-50">
                  {"Total Redemptions"}
                </span>
              </div>
            </div>
          </HeadingBodyCard>
          <div className="mt-4 w-full">
            <PromotionSettings
              promotion={promotion}
              openWithItems={openWithItems}
            />
          </div>
        </>
      )}
      <div className="mt-xlarge">
        <RawJSON data={promotion} title="Raw promotion" />
      </div>
      {!isLoading && promotion && (
        <PromotionFormProvider
          promotion={promotionToFormValuesMapper(promotion as any)} // suppressing type mismatch
          isEdit
        >
          <Fade isVisible={isOpen} isFullScreen={true}>
            <PromotionForm
              additionalOpen={openItems}
              closeForm={() => {
                setOpenItems([])
                setIsOpen(false)
              }}
              promotion={promotion}
              isEdit
            />
          </Fade>
        </PromotionFormProvider>
      )}
    </div>
  )
}

const getPromotionDescription = (promotion: Discount) => {
  switch (promotion.rule.type) {
    case "fixed":
      return (
        <div className="flex items-baseline">
          <h2 className="inter-xlarge-regular">
            {formatAmountWithSymbol({
              currency: promotion.regions[0].currency_code,
              amount: promotion.rule.value,
            })}
          </h2>
          <span className="inter-base-regular text-grey-50 ml-1">
            {promotion.regions[0].currency_code.toUpperCase()}
          </span>
        </div>
      )
    case "percentage":
      return (
        <div className="flex items-baseline">
          <h2 className="inter-xlarge-regular text-grey-90">
            {promotion.rule.value}
          </h2>
          <span className="inter-base-regular text-grey-50 ml-1">%</span>
        </div>
      )
    case "free_shipping":
      return (
        <h2 className="inter-xlarge-regular text-grey-90">{`FREE SHIPPING`}</h2>
      )
    default:
      return "Unknown promotion type"
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
                  {"Template promotion"}
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
