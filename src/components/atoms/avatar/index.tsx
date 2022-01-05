import React from "react"

type AvatarProps = {
  user?: {
    first_name?: string
    last_name?: string
    email: string
  }
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  let username: string

  if (user?.first_name && user?.last_name) {
    username = user.first_name + " " + user.last_name
  } else if (user?.email) {
    username = user.email
  } else {
    username = "Medusa user"
  }

  return (
    <div className="w-large h-large rounded-circle bg-violet-60 overflow-hidden">
      <div className="w-full h-full text-center text-grey-0">
        {username.slice(0, 1).toUpperCase()}
      </div>
    </div>
  )
}

export default Avatar
