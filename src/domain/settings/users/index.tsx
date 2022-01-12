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

            setElements([
              ...userData.users.map((user, i) => ({
                entity: user,
                entityType: "user",
                tableElement: getUserTableRow(user, i),
              })),
              ...inviteData.invites.map((invite, i) => ({
                entity: invite,
                entityType: "invite",
                tableElement: getInviteTableRow(invite, i),
              })),
            ])
          })
      })
  }, [shouldRefetch])

  useEffect(() => {
    setShownElements(elements)
  }, [elements])

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

  const getUserTableRow = (user, index) => {
    return (
      <Table.Row
        key={`user-${index}`}
        color={"inherit"}
        actions={[
          {
            label: "Edit User",
            onClick: () => setSelectedUser(user),
            icon: <EditIcon size={20} />,
          },
          {
            label: "Remove User",
            variant: "danger",
            onClick: () => {
              setDeleteUser(true)
              setSelectedUser(user)
            },
            icon: <TrashIcon size={20} />,
          },
        ]}
      >
        <Table.Cell>
          <SidebarTeamMember user={user} />
        </Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell className="inter-small-semibold text-violet-60">
          {user.role.charAt(0).toUpperCase()}
          {user.role.slice(1)}
        </Table.Cell>
        <Table.Cell></Table.Cell>
      </Table.Row>
    )
  }

  const getInviteTableRow = (invite, index) => {
    return (
      <Table.Row
        key={`invite-${index}`}
        actions={[
          {
            label: "Resend Invitation",
            onClick: () => {
              Medusa.invites
                .resend(invite.id)
                .then(() => {
                  toaster("Invitiation link has been resent", "success")
                })
                .then(() => triggerRefetch())
            },
            icon: <RefreshIcon size={20} />,
          },
          {
            label: "Remove Invitation",
            variant: "danger",
            onClick: () => {
              setSelectedInvite(invite)
            },
            icon: <TrashIcon size={20} />,
          },
        ]}
      >
        <Table.Cell className="text-grey-40">
          <SidebarTeamMember user={{ email: invite.user_email }} />
        </Table.Cell>
        <Table.Cell className="text-grey-40">{invite.user_email}</Table.Cell>
        <Table.Cell></Table.Cell>
        <Table.Cell>
          {new Date(invite?.expires_at) < new Date() ? (
            <StatusDot title={"Expired"} variant={"danger"} />
          ) : (
            <StatusDot title={"Pending"} variant={"success"} />
          )}
        </Table.Cell>
      </Table.Row>
    )
  }

  const filteringOptions = [
    {
      title: "Team permissions",
      options: [
        {
          title: "All",
          count: elements.length,
          onClick: () => setShownElements(elements),
        },
        {
          title: "Member",
          count: shownElements.filter(
            e => e.entityType === "user" && e.entity.role === "member"
          ).length,
          onClick: () =>
            setShownElements(
              shownElements.filter(
                e => e.entityType === "user" && e.entity.role === "member"
              )
            ),
        },
        {
          title: "Admin",
          count: shownElements.filter(
            e => e.entityType === "user" && e.entity.role === "admin"
          ).length,
          onClick: () =>
            setShownElements(
              shownElements.filter(
                e => e.entityType === "user" && e.entity.role === "admin"
              )
            ),
        },
        {
          title: "No team permissions",
          count: shownElements.filter(e => e.entityType === "invite").length,
          onClick: () =>
            setShownElements(
              shownElements.filter(e => e.entityType === "invite")
            ),
        },
      ],
    },
    {
      title: "Status",
      options: [
        {
          title: "All",
          count: elements.length,
          onClick: () => setShownElements(elements),
        },
        {
          title: "Active",
          count: shownElements.filter(e => e.entityType === "user").length,
          onClick: () =>
            setShownElements(
              shownElements.filter(e => e.entityType === "user")
            ),
        },
        {
          title: "Pending",
          count: shownElements.filter(
            e =>
              e.entityType === "invite" &&
              getInviteStatus(e.entity) === "pending"
          ).length,
          onClick: () =>
            setShownElements(
              shownElements.filter(
                e =>
                  e.entityType === "invite" &&
                  getInviteStatus(e.entity) === "pending"
              )
            ),
        },
        {
          title: "Expired",
          count: shownElements.filter(
            e =>
              e.entityType === "invite" &&
              getInviteStatus(e.entity) === "expired"
          ).length,
          onClick: () =>
            setShownElements(
              shownElements.filter(
                e =>
                  e.entityType === "invite" &&
                  getInviteStatus(e.entity) === "expired"
              )
            ),
        },
      ],
    },
  ]

  const handleUserSearch = (term: string) => {
    setShownElements(
      elements.filter(
        e =>
          e.entity?.first_name?.includes(term) ||
          e.entity?.last_name?.includes(term) ||
          e.entity?.email?.includes(term) ||
          e.entity?.user_email?.includes(term)
      )
    )
  }

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
            <Table
              filteringOptions={filteringOptions}
              enableSearch
              handleSearch={handleUserSearch}
            >
              <Table.Head>
                <Table.HeadRow>
                  <Table.HeadCell className="w-72">Name</Table.HeadCell>
                  <Table.HeadCell className="w-80">Email</Table.HeadCell>
                  <Table.HeadCell className="w-72">
                    Team permissions
                  </Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                </Table.HeadRow>
              </Table.Head>
              <Table.Body>{shownElements.map(e => e.tableElement)}</Table.Body>
            </Table>
            <div className="inter-small-regular text-grey-50">
              {users.length} member
              {users.length === 1 ? "" : "s"}
            </div>
          </div>
          {selectedUser &&
            (deleteUser ? (
              <DeletePrompt
                text={"Are you sure you want to remove this user?"}
                heading={"Remove user"}
                onDelete={() =>
                  Medusa.users
                    .delete(selectedUser.id)
                    .then(() => triggerRefetch())
                }
                handleClose={handleClose}
              />
            ) : (
              <EditUser
                handleClose={handleClose}
                user={selectedUser}
                onSubmit={triggerRefetch}
              />
            ))}
          {selectedInvite && (
            <DeletePrompt
              text={"Are you sure you want to remove this invite?"}
              heading={"Remove invite"}
              onDelete={() =>
                Medusa.invites
                  .delete(selectedInvite.id)
                  .then(() => triggerRefetch())
              }
              handleClose={handleClose}
            />
          )}
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
