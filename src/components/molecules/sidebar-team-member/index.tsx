import React from "react"
import Avatar from "../../atoms/avatar"
import clsx from "clsx"

type SidebarTeamMemberProps = {
  color?: string
  user: any
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

const SidebarTeamMember: React.FC<SidebarTeamMemberProps> = ({
  color = "bg-violet-40",
  user,
}: SidebarTeamMemberProps) => {
  const fullName =
    user.first_name || user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.email

  return (
    <div className="flex items-center bg-grey-0 px-2.5 py-1.5 w-full">
      <div className="w-[24px] h-[24px]">
        <Avatar user={user} color={color} />
      </div>
      <span className="pl-2.5 w-40 truncate">{fullName}</span>
    </div>
  )
}

export default SidebarTeamMember
