import React from "react"

type SidebarCompanyLogoProps = {
  imageUrl: string
  storeName: string
}

const SidebarCompanyLogo: React.FC<SidebarCompanyLogoProps> = ({
  imageUrl,
  storeName,
}: SidebarCompanyLogoProps) => {
  return (
    <div className="flex px-2 mb-3.5 items-center">
      <img className="object-contain h-7 w-7 mb-0" src={imageUrl} />
      <span className="font-semibold ml-2.5">{storeName}</span>
    </div>
  )
}

export default SidebarCompanyLogo
