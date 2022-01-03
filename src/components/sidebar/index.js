import React, { useEffect, useState } from "react"
import { ReactComponent as GiftCard } from "../../assets/svg/2.0/24px/gift-card.svg"
import { ReactComponent as Settings } from "../../assets/svg/2.0/24px/settings.svg"
import { ReactComponent as Discount } from "../../assets/svg/2.0/24px/percent.svg"
import { ReactComponent as Customer } from "../../assets/svg/2.0/24px/user.svg"
import { ReactComponent as Orders } from "../../assets/svg/2.0/24px/dollar-sign.svg"
import { ReactComponent as Products } from "../../assets/svg/2.0/24px/price-tag.svg"
import Medusa from "../../services/api"
import SidebarMenuItem from "../molecules/sidebar-menu-item"
import SidebarCompanyLogo from "../molecules/sidebar-company-logo"
import SidebarTeam from "../organisms/sidebar-team"

const Sidebar = ({}) => {
  const [storeName, setStoreName] = useState("")
  const [currentlyOpen, setCurrentlyOpen] = useState("")
  const [users, setUsers] = useState([])
  
  const productsChildren = [{pageLink: '/a/collections', text: 'Collections'}]
  const ordersChildren = [{pageLink: '/a/draft-orders', text: 'Drafts'}, {pageLink: '/a/swaps', text: 'Swaps'}, {pageLink: '/a/returns', text: 'Returns'}]

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
    Medusa.users.list().then(({data}) => {console.log(data)
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
    <div className="bg-grey-0 max-w-[240px] h-full">
      <SidebarCompanyLogo imageUrl={"https://img.icons8.com/ios/50/000000/online-shopping.png"} StoreName={storeName || "Medusa Store"} />

      <div className="border-b pb-3.5 border-grey-20">
        <SidebarMenuItem pageLink={'/a/orders'} icon={<Orders />} triggerHandler={triggerHandler} text={'Orders'} subItems={ordersChildren} />
        <SidebarMenuItem pageLink={'/a/products'} icon={<Products />} text={'Products'} triggerHandler={triggerHandler} subItems={productsChildren}/>
        <SidebarMenuItem pageLink={'/a/customers'} icon={<Customer />} triggerHandler={triggerHandler} text={'Customers'} />
        <SidebarMenuItem pageLink={'/a/discounts'} icon={<Discount />} triggerHandler={triggerHandler} text={'Discounts'} />
        <SidebarMenuItem pageLink={'/a/gift-cards'} icon={<GiftCard />} triggerHandler={triggerHandler} text={'Gift Cards'} />
        <SidebarMenuItem pageLink={'/a/settings'} icon={<Settings />} triggerHandler={triggerHandler} text={'Settings'} />
      </div>

      <div className="font-semibold mt-5 flex flex-col text-small">
        <SidebarTeam users={users}/>
      </div>
    </div>
  )
}

export default Sidebar
