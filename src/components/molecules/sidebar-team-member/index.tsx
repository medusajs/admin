import React from 'react'

const getInitial = (firstName, lastName) => {
  // return `${firstName?.charAt(0)?.toUpperCase() || ""}${lastName?.charAt(0)?.toUpperCase() || ""}`
  return firstName?.charAt(0)?.toUpperCase() || lastName?.charAt(0)?.toUpperCase() || ""
}

const getColor = (index) => {
  const colors = ["bg-fuschia-40", "bg-pink-40", "bg-orange-40", "bg-teal-40", "bg-cyan-40", "bg-blue-40", "bg-indigo-40"]
  return colors[index % colors.length]
}

const SidebarTeamMember = ({ index, user, profilePicture = undefined }) => {

  const fullName = user.first_name || user.last_name ? `${user.first_name} ${user.last_name}` : user.email

  const avatarClasses = `w-5 h-5 ${getColor(index)} text-grey-0 rounded-full text-center flex justify-center items-center`

  console.log(getColor(index))

  const avatar = profilePicture ? (
    <img className="w-5 h-5 mb-0 object-cover rounded-full" src={profilePicture} />
  ) :
    (
      <div className={avatarClasses} > {getInitial(user.first_name, user.last_name)}</div>
    )

  return (
    <div className="flex items-center bg-grey-0 px-2.5 py-1.5">
      {avatar}
      <span className="ml-2.5">{fullName}</span>
    </div>
  )
}

export default SidebarTeamMember