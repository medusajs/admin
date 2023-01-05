import React, { useContext } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import Avatar from "../../atoms/avatar"
import Button from "../../fundamentals/button"
import GearIcon from "../../fundamentals/icons/gear-icon"
import SignOutIcon from "../../fundamentals/icons/log-out-icon"
import { useNavigate } from "react-router-dom"
import { AccountContext } from "../../../context/account"

const UserMenu: React.FC = () => {
  const navigate = useNavigate()
  const { first_name, last_name, email, handleLogout } =
    useContext(AccountContext)

  const logOut = () => {
    handleLogout()
    navigate("/login")
  }
  return (
    <div className="w-large h-large">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <div className="w-full h-full cursor-pointer">
            <Avatar
              user={{ first_name, last_name, email }}
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
