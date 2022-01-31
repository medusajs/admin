import React from "react"
import Avatar from "../../atoms/avatar"

type CustomerAvatarItemProps = {
  color?: string
  customer: any
}

const getInitial = (
  firstName: string,
  lastName: string,
  email: string
): string => {
  return (
    firstName?.charAt(0)?.toUpperCase() ||
    lastName?.charAt(0)?.toUpperCase() ||
    email?.charAt(0)?.toUpperCase() ||
    ""
  )
}

const CustomerAvatarItem: React.FC<CustomerAvatarItemProps> = ({
  color = "bg-violet-60",
  customer,
}: CustomerAvatarItemProps) => {
  const fullName =
    customer.first_name || customer.last_name
      ? `${customer.first_name} ${customer.last_name}`
      : "-"

  return (
    <div className="flex items-center px-2.5 py-1.5 w-full">
      <div className="w-[24px] h-[24px]">
        <Avatar user={customer} color={color} />
      </div>
      <span className="pl-2.5 w-40 truncate">{fullName}</span>
    </div>
  )
}

export default CustomerAvatarItem
