import React from "react"
import { Link } from "gatsby"
import Collapsible from "react-collapsible"

type SidebarMenuSubitemProps = {
  pageLink: string
  text: string
}

type SidebarMenuItemProps = {
  pageLink: string
  text: string
  icon: JSX.Element
  triggerHandler: () => any
  subItems?: SidebarMenuSubitemProps[]
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  pageLink,
  icon,
  text,
  triggerHandler,
  subItems = [],
}: SidebarMenuItemProps) => {
  const activeStyles = "bg-grey-10 text-violet-50"
  return (
    <Collapsible
      transitionTime={150}
      transitionCloseTime={150}
      {...triggerHandler()}
      trigger={
        <Link
          className={`py-1.5 px-3 my-0.5 rounded-base flex text-grey-90 hover:bg-grey-10 items-center`}
          activeClassName={activeStyles}
          to={pageLink}
          partiallyActive
        >
          <span className="items-start">{icon}</span>
          <span className="ml-3">{text}</span>
        </Link>
      }
    >
      {subItems?.length > 0 &&
        subItems.map(({ pageLink, text }) => (
          <SubItem pageLink={pageLink} text={text} />
        ))}
    </Collapsible>
  )
}

const SubItem = ({ pageLink, text }: SidebarMenuSubitemProps) => {
  const activeStyles = "bg-grey-10 font-semibold"
  return (
    <Link
      className={`py-0.5 px-1 my-0.5 rounded-base flex hover:bg-grey-10`}
      activeClassName={activeStyles}
      to={pageLink}
      partiallyActive
    >
      <span className="text-grey-90 text-small ml-3">{text}</span>
    </Link>
  )
}

SidebarMenuItem.SubItem = SubItem

export default SidebarMenuItem
