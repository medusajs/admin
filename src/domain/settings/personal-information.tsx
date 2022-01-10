import React, { useEffect, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import TwoSplitPane from "../../components/templates/two-split-pane"
import BodyCard from "../../components/organisms/body-card"
import BreadCrumb from "../../components/molecules/breadcrumb"
import Spinner from "../../components/atoms/spinner"
import { AccountContext } from "../../context/account"
import useMedusa from "../../hooks/use-medusa"
import { navigate } from "gatsby"
import { getErrorMessage } from "../../utils/error-messages"
import Input from "../../components/molecules/input"
import FileUploadModal from "../../components/organisms/file-upload-modal"
import clsx from "clsx"
import Avatar from "../../components/atoms/avatar"

const PersonalInformation = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [isLoadingProfilePicture, setIsLoadingProfilePicture] = useState(false)
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

  const handleFileUpload = async files => {
    setModalIsOpen(false)
    setIsLoadingProfilePicture(true)
    //TODO upload files
    await new Promise(r => setTimeout(r, 2000))
    setIsLoadingProfilePicture(false)
  }

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
            <div
              onClick={() => setModalIsOpen(true)}
              className="w-28 h-28 p-2 mt-2 flex items-center justify-center rounded-rounded hover:bg-grey-5 cursor-pointer"
            >
              {isLoadingProfilePicture && (
                <div className="z-10 absolute justify-center items-center">
                  <Spinner variant="secondary" />
                </div>
              )}
              <div
                className={clsx("w-full h-full transition-opacity", {
                  "opacity-50": isLoadingProfilePicture,
                })}
              >
                <Avatar user={user} font="inter-3xlarge-semibold" />
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
          {modalIsOpen && (
            <FileUploadModal
              setFiles={handleFileUpload}
              handleClose={() => setModalIsOpen(false)}
            />
          )}
        </BodyCard>
      </TwoSplitPane>
    </div>
  )
}

export default PersonalInformation
