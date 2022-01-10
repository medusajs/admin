import React, { useEffect, useContext } from "react"
import { useForm } from "react-hook-form"
import TwoSplitPane from "../../components/templates/two-split-pane"
import BodyCard from "../../components/organisms/body-card"
import BreadCrumb from "../../components/molecules/breadcrumb"
import { AccountContext } from "../../context/account"
import useMedusa from "../../hooks/use-medusa"
import { navigate } from "gatsby"
import { getErrorMessage } from "../../utils/error-messages"
import Input from "../../components/molecules/input"

const PersonalInformation = () => {
  const { register, setValue, handleSubmit } = useForm()
  const { handleUpdateUser, ...user } = useContext(AccountContext)
  const { update, toaster, isLoading, ...test } = useMedusa("users", {
    id: user.id,
  })

  register("first_name")
  register("last_name")

  useEffect(() => {}, [isLoading])

  const submit = data => {
    handleUpdateUser(user.id, data)
      .then(() => {
        toaster("Successfully updated user", "success")
      })
      .catch(err => {
        toaster(getErrorMessage(err), "error")
      })
  }

  const events = [
    {
      label: "Save",
      onClick: handleSubmit(submit),
    },
    {
      label: "Cancel changes",
      onClick: () => navigate("/a/settings"),
    },
  ]

  return (
    <div>
      <BreadCrumb
        currentPage={"Personal information"}
        previousBreadcrumb={"Settings"}
        previousRoute="/a/settings"
      />
      <TwoSplitPane>
        <BodyCard
          title="Personal information"
          subtitle="Manage your Medusa profile"
          events={events}
        >
          <div>
            <span className="inter-base-semibold">Picture</span>
            <div className="w-28 h-28 p-2 mt-2 rounded-rounded hover:bg-grey-5 cursor-pointer">
              <div className="bg-teal-40 rounded-circle w-full h-full uppercase flex items-center justify-center inter-3xlarge-semibold text-grey-0">
                PK
              </div>
            </div>
          </div>

          <div className="mt-6">
            <span className="inter-base-semibold">General</span>
            <div className="flex mt-4">
              <Input
                label="First name"
                name="first_name"
                defaultValue={user.first_name}
                onChange={e => setValue("first_name", e.target.value)}
                className="mr-4"
              />
              <Input
                label="Last name"
                name="last_name"
                defaultValue={user.last_name}
                onChange={e => setValue("last_name", e.target.value)}
              />
            </div>
            <Input label="Email" value={user.email} disabled className="mt-6" />
          </div>
        </BodyCard>
      </TwoSplitPane>
    </div>
  )
}

export default PersonalInformation
