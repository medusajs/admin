import { RouteComponentProps } from "@reach/router"
import {
  useAdminGiftCard,
  useAdminRegions,
  useAdminUpdateGiftCard,
} from "medusa-react"
import moment from "moment"
import React, { useState } from "react"
import Spinner from "../../../components/atoms/spinner"
import Badge from "../../../components/fundamentals/badge"
import DollarSignIcon from "../../../components/fundamentals/icons/dollar-sign-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import PublishIcon from "../../../components/fundamentals/icons/publish-icon"
import UnpublishIcon from "../../../components/fundamentals/icons/unpublish-icon"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import StatusSelector from "../../../components/molecules/status-selector"
import BodyCard from "../../../components/organisms/body-card"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { formatAmountWithSymbol } from "../../../utils/prices"
import EditGiftCardModal from "./edit-gift-card-modal"
import UpdateBalanceModal from "./update-balance-modal"

type GiftCardDetailsProps = {
  id: string
} & RouteComponentProps

const GiftCardDetails: React.FC<GiftCardDetailsProps> = ({ id }) => {
  const { gift_card, isLoading } = useAdminGiftCard(id)
  const { regions } = useAdminRegions()

  const updateGiftCard = useAdminUpdateGiftCard(gift_card?.id)

  const notification = useNotification()

  const [showUpdateBalance, setShowUpdateBalance] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  const actions = [
    {
      label: "Edit",
      onClick: () => setShowEdit(true),
      icon: <EditIcon size={20} />,
    },
    {
      label: `${gift_card?.is_disabled ? "Activate" : "Disable"}`,
      onClick: () => handleUpdate({ is_disabled: !gift_card?.is_disabled }),
      icon: gift_card?.is_disabled ? (
        <PublishIcon size={20} />
      ) : (
        <UnpublishIcon size={20} />
      ),
    },
    {
      label: "Update balance",
      onClick: () => setShowUpdateBalance(true),
      icon: <DollarSignIcon size={20} />,
    },
  ]

  const handleUpdate = (data) => {
    updateGiftCard.mutate(
      { ...data },
      {
        onSuccess: () => {
          notification("Success", "Succesfully updated Gift Card", "success")
          setShowEdit(false)
          setShowUpdateBalance(false)
        },
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
      }
    )
  }

  return (
    <div>
      <Breadcrumb
        currentPage={"Gift Card Details"}
        previousBreadcrumb={"Gift Cards"}
        previousRoute="/a/gift-cards"
      />
      {isLoading || !gift_card ? (
        <div className="w-full bg-grey-0 border border-grey-20 rounded-rounded py-xlarge flex items-center justify-center">
          <Spinner size={"large"} variant={"secondary"} />
        </div>
      ) : (
        <BodyCard
          className={"h-auto min-h-0 w-full"}
          title={`${gift_card?.code}`}
          subtitle={`Gift Card id: ${gift_card?.id}`}
          status={
            <StatusSelector
              isDraft={!!gift_card?.is_disabled}
              activeState={"Active"}
              draftState={"Disable"}
              onChange={() =>
                handleUpdate({ is_disabled: !gift_card?.is_disabled })
              }
            />
          }
          actionables={actions}
        >
          <div className="flex justify-between">
            <div className="flex mt-6 space-x-6 divide-x">
              <div className="flex flex-col">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  Original amount
                </div>
                <div>
                  {formatAmountWithSymbol({
                    amount: gift_card?.value,
                    currency: gift_card?.region.currency_code,
                  })}
                </div>
              </div>
              <div className="flex flex-col pl-6">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  Balance
                </div>
                <div>
                  {formatAmountWithSymbol({
                    amount: gift_card?.balance,
                    currency: gift_card?.region.currency_code,
                  })}
                </div>
              </div>
              <div className="flex flex-col pl-6">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  Created
                </div>
                <div>{moment(gift_card?.created_at).format("DD MMM YYYY")}</div>
              </div>
            </div>
            <div className="flex items-end">
              <Badge variant="default">{gift_card?.region?.name}</Badge>
            </div>
          </div>
        </BodyCard>
      )}
      {showUpdateBalance && (
        <UpdateBalanceModal
          giftCard={gift_card}
          currencyCode={gift_card?.region?.currency_code}
          handleClose={() => setShowUpdateBalance(false)}
          handleSave={handleUpdate}
          updating={updateGiftCard.isLoading}
        />
      )}
      {showEdit && (
        <EditGiftCardModal
          handleClose={() => setShowEdit(false)}
          handleSave={handleUpdate}
          regions={regions}
          region={gift_card?.region}
          updating={updateGiftCard.isLoading}
        />
      )}
    </div>
  )
}

export default GiftCardDetails
