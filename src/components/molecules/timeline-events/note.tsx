import { useAdminUser } from "medusa-react"
import React from "react"
import Avatar from "../../atoms/avatar"
import EventContainer from "./event-container"
import { EventType } from "./event-type"

type NoteProps = {
  author_id: string
  value: string
} & EventType

const note: React.FC<NoteProps> = ({ author_id, time }) => {
  const { user, isLoading } = useAdminUser(author_id)

  if (isLoading || !user) {
    return <div>Loading...</div>
  }

  const name =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.email

  return (
    <EventContainer
      title={name}
      icon={<Avatar user={user} />}
      date={time}
    ></EventContainer>
  )
}

export default note
