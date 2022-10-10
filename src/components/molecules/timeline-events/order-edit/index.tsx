import React from "react"
import Avatar from "../../../atoms/avatar"

type ByLineProps = {
  user: { first_name: string; last_name: string; email: string }
}
export const ByLine: React.FC<ByLineProps> = ({ user }) => (
  <div className="flex inter-small-regular items-center text-grey-50">
    By
    <span className="w-base h-base mx-xsmall">
      <Avatar user={user} font="inter-xsmall-semibold" />
    </span>
    {`${user?.first_name || ""} ${user?.last_name || ""}`}
  </div>
)
