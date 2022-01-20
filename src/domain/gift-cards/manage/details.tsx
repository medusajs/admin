import { useAdminProduct, useAdminStore } from "medusa-react"
import React from "react"
import { useForm } from "react-hook-form"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import Input from "../../../components/molecules/input"
import BodyCard from "../../../components/organisms/body-card"
import DenominationTable from "./denomination-table"

const ManageGiftCard = ({ id }) => {
  const { register, setValue, handleSubmit } = useForm()
  const { product, isLoading } = useAdminProduct(id)

  // variants: productVariants.map((v, index) => ({
  // ..._.pick(v, [
  //   "id",
  //   "published",
  //   "image",
  //   "barcode",
  //   "ean",
  //   "sku",
  //   "inventory_quantity",
  //   "manage_inventory",
  //   "metadata",
  // ]),
  // title: `${index + 1}`,
  // prices: v.prices.map(({ amount, currency_code, region_id }) => ({
  //   amount,
  //   currency_code,
  //   region_id,
  // })),
  // options: [
  //   {
  //     option_id: product.options[0].id,
  //     value: index + 1,
  //   },
  // ],
  // })),

  const { store } = useAdminStore()

  register("title")
  register("subtitle")
  register("description")

  //   const submit = (data) => {
  //     handleUpdateUser(user.id, data)
  //       .then(() => {
  //         toaster("Successfully updated user", "success")
  //       })
  //       .catch((err) => {
  //         toaster(getErrorMessage(err), "error")
  //       })
  //   }

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
          <div className="flex space-x-8">
            <div className="flex flex-col w-1/2 space-y-4">
              <Input
                label="Name"
                name="title"
                defaultValue={product?.title}
                onChange={(e) => setValue("title", e.target.value)}
              />
              <Input
                label="Subtitle"
                name="subtitle"
                placeholder="Add a subtitle"
                defaultValue={product?.subtitle}
                onChange={(e) => setValue("subtitle", e.target.value)}
              />
            </div>
            <Input
              label="Description"
              defaultValue={product?.description}
              className="w-1/2"
              onChange={(e) => setValue("description", e.target.value)}
            />
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
            giftCardId={product?.id || ""}
            denominations={product?.variants || []}
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
