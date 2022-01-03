import React from 'react'

const getInitial = (firstName, lastName, email) => {
  return firstName?.charAt(0)?.toUpperCase() || lastName?.charAt(0)?.toUpperCase() || email?.charAt(0)?.toUpperCase() || ""
}

const SidebarTeamMember = ({ color = 'bg-violet-40', user, profilePicture = undefined }) => {

  const fullName = user.first_name || user.last_name ? `${user.first_name} ${user.last_name}` : user.email

  const avatarClasses = `w-5 h-5 ${color} text-grey-0 rounded-full text-center flex justify-center items-center`

  const avatar = profilePicture ? (
    <img className="w-5 h-5 mb-0 object-cover rounded-full" src={profilePicture} />
  ) :
    (
      <div className={avatarClasses} > {getInitial(user.first_name, user.last_name, user.email)}</div>
    )

  return (
    <div className="flex items-center bg-grey-0 px-2.5 py-1.5">
      <div className='w-5 h-5'>
        {avatar}
      </div>
      <span className="pl-2.5 truncate">
        {fullName}
      </span>
    </div>
  )
}

export default SidebarTeamMember