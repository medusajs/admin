import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { useAdminDeleteSession, useAdminGetSession } from "medusa-react"
import React from "react"
import { useNavigate } from "react-router-dom"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import Avatar from "../../atoms/avatar"
import Button from "../../fundamentals/button"
import GearIcon from "../../fundamentals/icons/gear-icon"
import SignOutIcon from "../../fundamentals/icons/log-out-icon"

const UserMenu: React.FC = () => {
  const navigate = useNavigate()

  const { user, isLoading } = useAdminGetSession()
  const { mutate } = useAdminDeleteSession()

  const notification = useNotification()

  const logOut = () => {
    mutate(undefined, {
      onSuccess: () => {
        navigate("/login")
      },
      onError: (err) => {
        notification("Failed to log out", getErrorMessage(err), "error")
      },
    })
  }
  return (
    <div className="w-large h-large">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild disabled={isLoading}>
          <div className="w-full h-full cursor-pointer">
            <Avatar
              user={{ ...user }}
              isLoading={isLoading}
              color="bg-fuschia-40"
            />
          </div>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          sideOffset={5}
          className="border bg-grey-0 border-grey-20 rounded-rounded shadow-dropdown p-xsmall min-w-[200px] z-30"
        >
          <DropdownMenu.Item className="mb-1 last:mb-0">
            <Button
              variant="ghost"
              size="small"
              className={"w-full justify-start"}
              onClick={() => navigate("/a/settings")}
            >
              <GearIcon />
              Settings
            </Button>
            <Button
              variant="ghost"
              size="small"
              className={"w-full justify-start text-rose-50"}
              onClick={() => logOut()}
            >
              <SignOutIcon size={20} />
              Sign out
            </Button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  )
}

export default UserMenu
