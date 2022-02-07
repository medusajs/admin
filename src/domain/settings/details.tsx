import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import BreadCrumb from "../../components/molecules/breadcrumb"
import Input from "../../components/molecules/input"
import BodyCard from "../../components/organisms/body-card"
import useToaster from "../../hooks/use-toaster"
import { getErrorMessage } from "../../utils/error-messages"
import { useAdminStore, useAdminUpdateStore } from "medusa-react"

const AccountDetails = () => {
  const { register, reset, handleSubmit } = useForm()
  const { store, isSuccess } = useAdminStore()
  const updateStore = useAdminUpdateStore()
  const toaster = useToaster()

  useEffect(() => {
    if (!isSuccess) return
    reset({
      name: store.name,
      swap_link_template: store.swap_link_template,
      payment_link_template: store.payment_link_template,
      invite_link_template: store.invite_link_template,
    })
  }, [store, isSuccess, reset])

  const handleCancel = () => {
    reset({
      name: store.name,
      swap_link_template: store.swap_link_template,
      payment_link_template: store.payment_link_template,
      invite_link_template: store.invite_link_template,
    })
  }

  const onSubmit = data => {
    if (
      !validateUrl(data.swap_link_template) ||
      !validateUrl(data.payment_link_template) ||
      !validateUrl(data.invite_link_template)
    ) {
      toaster("Malformed url", "error")
      return
    }

    updateStore.mutate(data, {
      onSuccess: () => {
        toaster("Successfully updated store", "success")
      },
      onError: (error) => {
        toaster(getErrorMessage(error), "error")
      },
    })
  }

  return (
    <form className="flex-col py-5">
      <div className="max-w-[632px]">
        <BreadCrumb
          previousRoute="/a/settings/"
          previousBreadcrumb="Settings"
          currentPage="Store Details"
        />
        <BodyCard
          events={[
            {
              label: "Save",
              type: "button",
              onClick: handleSubmit(onSubmit),
            },
            { label: "Cancel Changes", type: "button", onClick: handleCancel },
          ]}
          title="Store Details"
          subtitle="Manage your business details"
        >
          <h6 className="mt-large inter-base-semibold">General</h6>
          <Input
            className="mt-base"
            label="Store name"
            name="name"
            placeholder="Medusa Store"
            ref={register}
          />
          <h6 className="mt-2xlarge inter-base-semibold">Advanced settings</h6>
          <Input
            className="mt-base"
            label="Swap link template"
            name="swap_link_template"
            placeholder="https://acme.inc/swap"
            ref={register}
          />
          <Input
            className="mt-base"
            label="Draft order link template"
            name="payment_link_template"
            placeholder="https://acme.inc/swap"
            ref={register}
          />
          <Input
            className="mt-base"
            label="Invite link template"
            name="invite_link_template"
            placeholder="https://acme.inc/invite={invite_token}"
            ref={register}
          />
        </BodyCard>
      </div>
    </form>
  )
}

const validateUrl = address => {
  if (!address || address === "") {
    return true
  }

  try {
    const url = new URL(address)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch (_) {
    return false
  }
}

export default AccountDetails
