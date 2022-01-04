import React, { useEffect, useState } from "react"
import Medusa from "../../services/api"
import SidebarMenuItem from "../molecules/sidebar-menu-item"
import SidebarCompanyLogo from "../molecules/sidebar-company-logo"
import SidebarTeam from "./sidebar-team"

import GiftIcon from "../fundamentals/icons/gift-icon"
import GearIcon from "../fundamentals/icons/gear-icon"
import PercentIcon from "../fundamentals/icons/percent-icon"
import CustomerIcon from "../fundamentals/icons/customer-icon"
import DollarSignIcon from "../fundamentals/icons/dollar-sign-icon"
import TagIcon from "../fundamentals/icons/tag-icon"

const Sidebar: React.FC = () => {
  const [storeName, setStoreName] = useState("")
  const [currentlyOpen, setCurrentlyOpen] = useState(-1)
  const [users, setUsers] = useState([])

  const productsChildren = [{ pageLink: "/a/collections", text: "Collections" }]
  const ordersChildren = [
    { pageLink: "/a/draft-orders", text: "Drafts" },
    { pageLink: "/a/swaps", text: "Swaps" },
    { pageLink: "/a/returns", text: "Returns" },
  ]

  const fetchStore = async () => {
    const cache = localStorage.getItem("medusa::cache::store")
    if (cache) {
      setStoreName(cache)
    } else {
      const { data } = await Medusa.store.retrieve()
      if (data.store) {
        localStorage.setItem("medusa::cache::store", data.store.name)
        setStoreName(data.store.name)
      }
    }
  }

  const fetchUsers = async () => {
    Medusa.users.list().then(({ data }) => {
      setUsers(data.users)
    })
  }

  useEffect(() => {
    fetchStore()
    fetchUsers()
  }, [])

  const triggerHandler = () => {
    const id = triggerHandler.id++
    return {
      open: currentlyOpen === id,
      handleTriggerClick: () => setCurrentlyOpen(id),
    }
  }
  // We store the `id` counter on the function object, as a state creates
  // infinite updates, and we do not want the variable to be free floating.
  triggerHandler.id = 0

  return (
    <div className="min-w-sidebar max-w-sidebar h-screen overflow-y-scroll bg-gray-0 border-r border-grey-20 py-4xlarge px-base">
      <div className="h-full ">
        <SidebarCompanyLogo
          imageUrl={"https://img.icons8.com/ios/50/000000/online-shopping.png"}
          storeName={storeName || "Medusa Store"}
        />

        <div className="border-b pb-3.5 border-grey-20">
          <SidebarMenuItem
            pageLink={"/a/orders"}
            icon={<DollarSignIcon />}
            triggerHandler={triggerHandler}
            text={"Orders"}
            subItems={ordersChildren}
          />
          <SidebarMenuItem
            pageLink={"/a/products"}
            icon={<TagIcon />}
            text={"Products"}
            triggerHandler={triggerHandler}
            subItems={productsChildren}
          />
          <SidebarMenuItem
            pageLink={"/a/customers"}
            icon={<CustomerIcon />}
            triggerHandler={triggerHandler}
            text={"Customers"}
          />
          <SidebarMenuItem
            pageLink={"/a/discounts"}
            icon={<PercentIcon />}
            triggerHandler={triggerHandler}
            text={"Discounts"}
          />
          <SidebarMenuItem
            pageLink={"/a/gift-cards"}
            icon={<GiftIcon />}
            triggerHandler={triggerHandler}
            text={"Gift Cards"}
          />
          <SidebarMenuItem
            pageLink={"/a/settings"}
            icon={<GearIcon />}
            triggerHandler={triggerHandler}
            text={"Settings"}
          />
        </div>

        <div className="font-semibold mt-5 flex flex-col text-small">
          <SidebarTeam users={users} />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
