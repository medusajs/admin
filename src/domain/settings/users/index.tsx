import React, { useEffect, useState } from "react"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import Medusa from "../../../services/api"
import BodyCard from "../../../components/organisms/body-card"
import InviteModal from "../../../components/organisms/invite-modal"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import UserTable from "../../../components/templates/user-table"
import DraggableTable from "../../../components/templates/draggable-table"

const Users: React.FC = () => {
  const [users, setUsers] = useState([])
  const [invites, setInvites] = useState([])
  const [shouldRefetch, setShouldRefetch] = useState(0)
  const [showInviteModal, setShowInviteModal] = useState(false)

  const [entities, setEntities] = useState<any[]>([...users, ...invites])
  useEffect(() => setEntities([...users, ...invites]), [users, invites])

  const triggerRefetch = () => {
    setShouldRefetch((prev) => prev + 1)
  }

  useEffect(() => {
    Medusa.users
      .list()
      .then((res) => res.data)
      .then((userData) => {
        Medusa.invites
          .list()
          .then((res) => res.data)
          .then((inviteData) => {
            setUsers(userData.users)
            setInvites(inviteData.invites)
            setEntities([...userData.users, ...inviteData.invites])
          })
      })
  }, [shouldRefetch])

  const actionables = [
    {
      label: "Invite Users",
      onClick: () => setShowInviteModal(true),
      icon: (
        <span className="text-grey-90">
          <PlusIcon size={20} />
        </span>
      ),
    },
  ]

  const columns = [
    {
      Header: "ID",
      accessor: "id", // accessor is the "key" in the data
    },
    {
      Header: "Role",
      accessor: "role",
    },
  ]

  return (
    <div className="flex flex-col grow h-full">
      <div className="w-full flex flex-col grow">
        <BreadCrumb
          previousRoute="/a/settings"
          previousBreadcrumb="Settings"
          currentPage="The Team"
        />
        <BodyCard
          title="The Team"
          subtitle="Manage users of your Medusa Store"
          actionables={actionables}
        >
          <div className="flex grow  flex-col pt-2">
            <UserTable
              users={users}
              invites={invites}
              triggerRefetch={triggerRefetch}
            />
            <DraggableTable
              entities={entities}
              setEntities={setEntities}
              columns={columns}
            />
          </div>
          <div className="inter-small-regular text-grey-50">
            {users.length} member
            {users.length === 1 ? "" : "s"}
          </div>

          {showInviteModal && (
            <InviteModal
              handleClose={() => {
                triggerRefetch()
                setShowInviteModal(false)
              }}
            />
          )}
        </BodyCard>
      </div>
    </div>
  )
}

export default Users
