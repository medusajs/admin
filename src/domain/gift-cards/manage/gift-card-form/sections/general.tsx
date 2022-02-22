import {
  useAdminDeleteProduct,
  useAdminProductTypes,
  useAdminUpdateProduct,
} from "medusa-react"
import React from "react"
import { Controller } from "react-hook-form"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import UnpublishIcon from "../../../../../components/fundamentals/icons/unpublish-icon"
import Input from "../../../../../components/molecules/input"
import Select from "../../../../../components/molecules/select"
import StatusSelector from "../../../../../components/molecules/status-selector"
import TagInput from "../../../../../components/molecules/tag-input"
import BodyCard from "../../../../../components/organisms/body-card"
import DetailsCollapsible from "../../../../../components/organisms/details-collapsible"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"
import { useGiftCardForm } from "../form/gift-card-form-context"

const General = ({ giftCard }) => {
  const updateStatus = useAdminUpdateProduct(giftCard.id)
  const deleteGiftCard = useAdminDeleteProduct(giftCard.id)
  const { register, control } = useGiftCardForm()
  const { types } = useAdminProductTypes()

  const typeOptions =
    types?.map((type) => ({ label: type.value, value: type.id })) || []
  const notification = useNotification()

  const onUpdate = (payload) => {
    updateStatus.mutate(payload, {
      onSuccess: () => {
        notification("Success", "Successfully status of gift card", "success")
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
      },
    })
  }

  const onDelete = () => {
    deleteGiftCard.mutate(undefined, {
      onSuccess: () => {
        notification("Success", "Successfully deleted gift card", "success")
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
      },
    })
  }

  return (
    <BodyCard
      title="General"
      subtitle="Manage the settings for your Gift Card"
      className={"h-auto w-full"}
      status={
        <StatusSelector
          activeState="Published"
          draftState="Draft"
          isDraft={giftCard?.status === "draft"}
          onChange={() => {
            if (giftCard?.status === "published") {
              onUpdate({ status: "draft" })
            } else {
              onUpdate({ status: "published" })
            }
          }}
        />
      }
      actionables={[
        {
          label:
            giftCard?.status !== "published"
              ? "Publish Gift Card"
              : "Unpublish Gift Card",
          onClick: () => {
            if (giftCard?.status === "published") {
              onUpdate({ status: "draft" })
            } else {
              onUpdate({ status: "published" })
            }
          },
          icon: <UnpublishIcon size="16" />,
        },
        {
          label: "Delete Gift Card",
          onClick: onDelete,
          variant: "danger",
          icon: <TrashIcon size="16" />,
        },
      ]}
    >
      <div className="flex flex-col space-y-6">
        <div className="flex space-x-8">
          <div className="flex flex-col w-1/2 space-y-4">
            <Input
              label="Name"
              name="title"
              placeholder="Add name"
              defaultValue={giftCard.title}
              ref={register}
            />
            <Input
              label="Subtitle"
              name="subtitle"
              placeholder="Add a subtitle"
              defaultValue={giftCard.subtitle}
              ref={register}
            />
          </div>
          <Input
            label="Description"
            name="description"
            placeholder="Add a description"
            defaultValue={giftCard.description}
            className="w-1/2"
            ref={register}
          />
        </div>
        <DetailsCollapsible triggerProps={{ className: "ml-2" }}>
          <div className="flex space-x-8 pb-4">
            <div className="flex flex-col w-1/2 space-y-4">
              <Input
                label="Handle"
                name="handle"
                placeholder="Product handle"
                defaultValue={giftCard?.handle}
                ref={register}
                tooltipContent="URL of the product"
              />
              <Controller
                control={control}
                name="type"
                options={typeOptions}
                render={({ onChange, value }) => {
                  return (
                    <Select
                      label="Type"
                      onChange={onChange}
                      value={value || null}
                      options={typeOptions}
                    />
                  )
                }}
              />
            </div>
            <Controller
              name="tags"
              render={({ onChange, value }) => {
                return (
                  <TagInput
                    label="Tags (separated by comma)"
                    placeholder="Spring, Summer..."
                    onChange={onChange}
                    values={value || []}
                  />
                )
              }}
              control={control}
            />
          </div>
        </DetailsCollapsible>
      </div>
    </BodyCard>
  )
}

export default General
