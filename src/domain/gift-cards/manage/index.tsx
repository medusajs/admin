import {
  useAdminProduct,
  useAdminStore,
  useAdminUpdateGiftCard,
} from "medusa-react"
import React from "react"
import { useForm } from "react-hook-form"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import Input from "../../../components/molecules/input"
import TagInput from "../../../components/molecules/tag-input"
import BodyCard from "../../../components/organisms/body-card"
import useToaster from "../../../hooks/use-toaster"
import { getErrorMessage } from "../../../utils/error-messages"
import DenominationTable from "./denomination-table"

type ManageGiftCardProps = {
  path: string
  id: string
}

const ManageGiftCard: React.FC<ManageGiftCardProps> = ({ id }) => {
  const { register, setValue, handleSubmit } = useForm()
  const { product: giftCard } = useAdminProduct(id)

  const { store } = useAdminStore()
  const toaster = useToaster()

  const updateGiftCard = useAdminUpdateGiftCard(giftCard?.id)

  register("title")
  register("subtitle")
  register("description")

  const submit = (data) => {
    updateGiftCard.mutate(
      {
        ...data,
      },
      {
        onSuccess: () => toaster("Successfully updated Gift Card", "success"),
        onError: (err) => toaster(getErrorMessage(err), "error"),
      }
    )
  }

  return (
    <div>
      <BreadCrumb
        currentPage={"Manage Gift Card"}
        previousBreadcrumb={"Gift Cards"}
        previousRoute="/a/giftcards"
      />
      <div className="flex flex-col space-y-4">
        <BodyCard
          title="Product information"
          subtitle="Manage the settings for your Gift Card"
          className={"h-auto w-full"}
        >
          <div className="flex flex-col space-y-8">
            <div className="flex space-x-8">
              <div className="flex flex-col w-1/2 space-y-4">
                <Input
                  label="Name"
                  name="title"
                  defaultValue={giftCard?.title}
                  onChange={(e) => setValue("title", e.target.value)}
                />
                <Input
                  label="Subtitle"
                  name="subtitle"
                  placeholder="Add a subtitle"
                  defaultValue={giftCard?.subtitle}
                  onChange={(e) => setValue("subtitle", e.target.value)}
                />
              </div>
              <Input
                label="Description"
                name="description"
                defaultValue={giftCard?.description}
                className="w-1/2"
                onChange={(e) => setValue("description", e.target.value)}
              />
            </div>
            <div className="flex space-x-8">
              <div className="flex flex-col w-1/2 space-y-4">
                <Input
                  label="Handle"
                  name="handle"
                  defaultValue={giftCard?.title}
                  onChange={(e) => setValue("title", e.target.value)}
                />
                <Input
                  label="Type"
                  name="type"
                  placeholder="Add a subtitle"
                  defaultValue={giftCard?.subtitle}
                  onChange={(e) => setValue("subtitle", e.target.value)}
                />
              </div>
              <TagInput
                label="Tags (separated by comma)"
                defaultValue={giftCard?.description}
                className="w-1/2"
                values={[]}
                onChange={(e) => setValue("description", e.target.value)}
              />
            </div>
          </div>
        </BodyCard>
        <BodyCard
          title="Denominations"
          subtitle="Manage your denominations"
          className={"h-auto w-full"}
          actionables={[
            {
              label: "Add denominations",
              onClick: () => console.log("TODO: Should open modal"),
              icon: <PlusIcon />,
            },
          ]}
        >
          <DenominationTable
            giftCardId={giftCard?.id || ""}
            denominations={giftCard?.variants || []}
            defaultCurrency={store?.default_currency_code || ""}
          />
        </BodyCard>
        <BodyCard
          title="Images"
          subtitle="Manage your Gift Card images"
          className={"h-auto w-full"}
        ></BodyCard>
      </div>
    </div>
  )
}

export default ManageGiftCard
