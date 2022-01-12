import React, { useEffect, useState } from "react"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import RefreshIcon from "../../../components/fundamentals/icons/refresh-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Table from "../../../components/molecules/table"
import StatusDot from "../../../components/fundamentals/status-dot"
import Medusa from "../../../services/api"
import EditUser from "./edit"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import BodyCard from "../../../components/organisms/body-card"
import InviteModal from "../../../components/organisms/invite-modal"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import SidebarTeamMember from "../../../components/molecules/sidebar-team-member"
import useMedusa from "../../../hooks/use-medusa"
import UserTable from "../../../components/templates/user-table"

type UserListElement = {
  entity: any
  entityType: string
  tableElement: JSX.Element
}

const getInviteStatus = invite => {
  return new Date(invite.expires_at) < new Date() ? "expired" : "pending"
}

const Users: React.FC = () => {
  const [elements, setElements] = useState<UserListElement[]>([])
  const [shownElements, setShownElements] = useState<UserListElement[]>([])
  const [users, setUsers] = useState([])
  const [invites, setInvites] = useState([])
  const [shouldRefetch, setShouldRefetch] = useState(0)
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteUser, setDeleteUser] = useState(false)
  const [selectedInvite, setSelectedInvite] = useState(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const { toaster } = useMedusa("store")

  const handleClose = () => {
    setDeleteUser(false)
    setSelectedUser(null)
    setSelectedInvite(null)
  }

  const triggerRefetch = () => {
    setShouldRefetch(prev => prev + 1)
  }

  useEffect(() => {
    Medusa.users
      .list()
      .then(res => res.data)
      .then(userData => {
        Medusa.invites
          .list()
          .then(res => res.data)
          .then(inviteData => {
            setUsers(userData.users)
            setInvites(inviteData.invites)
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

  return (
    <div className="w-full h-full pb-4">
      <BreadCrumb
        previousRoute="/a/settings"
        previousBreadcrumb="Settings"
        currentPage="The Team"
      />
      <div className="h-full">
        <BodyCard
          title="The Team"
          subtitle="Manage users of your Medusa Store"
          actionables={actionables}
        >
          <div className="flex h-full justify-between flex-col pt-2">
            <UserTable
              users={users}
              invites={invites}
              triggerRefetch={triggerRefetch}
            />
            <div className="inter-small-regular text-grey-50">
              {users.length} member
              {users.length === 1 ? "" : "s"}
            </div>
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
