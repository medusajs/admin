import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import BreadCrumb from "../../components/molecules/breadcrumb"
import Input from "../../components/molecules/input"
import BodyCard from "../../components/organisms/body-card"
import useMedusa from "../../hooks/use-medusa"
import { getErrorMessage } from "../../utils/error-messages"

const AccountDetails = () => {
  const { register, reset, handleSubmit } = useForm()
  const { store, isLoading, update, toaster } = useMedusa("store")

  useEffect(() => {
    if (isLoading) return
    reset({
      name: store.name,
      swap_link_template: store.swap_link_template,
      payment_link_template: store.payment_link_template,
      invite_link_template: store.invite_link_template,
    })
  }, [store, isLoading])

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

  const onSubmit = data => {
    if (
      !validateUrl(data.swap_link_template) ||
      !validateUrl(data.payment_link_template) ||
      !validateUrl(data.invite_link_template)
    ) {
      toaster("Malformed url", "error")
      return
    }

    try {
      localStorage.removeItem("medusa::cache::store")
      update(data)
      toaster("Successfully updated store", "success")
      window.location.reload()
    } catch (error) {
      toaster(getErrorMessage(error), "error")
    }
  }

  return (
    <form className="flex-col py-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <BreadCrumb
          previousRoute="/a/settings/"
          previousBreadCrumb="Settings"
          currentPage="Account details"
        />
        <BodyCard
          events={[
            {
              label: "Save",
              // onClick: handleSubmit(onSubmit),
            },
            { label: "Cancel Changes" },
          ]}
          title="Store details"
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
          <span className="inter-small-regular text-grey-50">
            Manual-fulfillment via manual
          </span>
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

export default AccountDetails
