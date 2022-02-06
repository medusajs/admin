import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { navigate } from "gatsby"
import React, { useContext } from "react"
import { AccountContext } from "../../../context/account"
import Avatar from "../../atoms/avatar"
import Button from "../../fundamentals/button"
import GearIcon from "../../fundamentals/icons/gear-icon"
import SignOutIcon from "../../fundamentals/icons/log-out-icon"
import NotificationBell from "../../molecules/notification-bell"
import SearchBar from "../../molecules/search-bar"

const Topbar: React.FC = () => {
  const { first_name, last_name, email, handleLogout } = useContext(
    AccountContext
  )

  const logOut = () => {
    handleLogout()
    navigate("/login")
  }

  return (
    <div className="w-full min-h-topbar max-h-topbar pr-xlarge pl-base bg-grey-0 border-b border-grey-20 sticky top-0 flex items-center justify-between z-40">
      <SearchBar />
      <div className="flex items-center">
        <NotificationBell hasNotifications={false} />
        <div className="ml-large w-large h-large">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <div className="cursor-pointer w-full h-full">
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
      </div>
    </div>
  )
}

export default Topbar
