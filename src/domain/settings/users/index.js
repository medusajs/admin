import React, { useEffect, useState } from "react"
import BreadCrumb from "../../../components/breadcrumb"
import RefreshIcon from "../../../components/fundamentals/icons/refresh-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Table from "../../../components/molecules/table"
import Badge from "../../../components/fundamentals/badge"
import Medusa from "../../../services/api"
import EditUser from "./edit"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import BodyCard from "../../../components/organisms/body-card"
import InviteModal from "../../../components/organisms/invite-modal"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import SidebarTeamMember from "../../../components/molecules/sidebar-team-member"
import useMedusa from "../../../hooks/use-medusa"
import FilteringOptions from "../../../components/molecules/table/filtering-option"

const Users = () => {
  const [users, setUsers] = useState([])
  const [invites, setInvites] = useState([])
  const [shouldRefetch, setShouldRefetch] = useState(0)
  const [selectedUser, setSelectedUser] = useState(null)
  const [deleteUser, setDeleteUser] = useState(false)
  const [selectedInvite, setSelectedInvite] = useState(null)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const { toaster } = useMedusa("store")
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(10)

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
        const users = [...userData.users]
        setUsers(users.map((user, i) => getUserTableRow(user, i)))
      })

    Medusa.invites
      .list()
      .then(res => res.data)
      .then(inviteData => {
        const invites = [...inviteData.invites]
        setInvites(invites.map((inv, i) => getInviteTableRow(inv, i)))
      })
  }, [shouldRefetch])

  const handlePagination = direction => {
    const updatedOffset = direction === "next" ? offset + limit : offset - limit
    setOffset(updatedOffset)
  }

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
        key={index}
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
        key={index}
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
            <Badge variant="danger">Expired</Badge>
          ) : (
            <Badge variant="success">Pending</Badge>
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
          count: 2,
          onClick: () => console.log("filtering test"),
        },
        {
          title: "Member",
          count: 3,
          onClick: () => console.log("filtering test 2"),
        },
        {
          title: "Admin",
          count: 3,
          onClick: () => console.log("filtering test 2"),
        },
      ],
    },
    {
      className: "ml-6",
      title: "Status",
      options: [
        {
          title: "All",
          count: 9,
          onClick: () => console.log("filtering test"),
        },
        {
          title: "Active",
          count: 2,
          onClick: () => console.log("filtering test 2"),
        },
        {
          title: "Pending",
          count: 0,
          onClick: () => console.log("filtering test 2"),
        },
        {
          title: "Expired",
          count: 3,
          onClick: () => console.log("filtering test 2"),
        },
      ],
    },
  ]

  return (
    <div className="w-full h-full">
      <BreadCrumb
        previousRoute="/a/settings"
        previousBreadCrumb="Settings"
        currentPage="The Team"
      />
      <BodyCard
        title="The Team"
        subtitle="Manage users of your Medusa Store"
        actionables={actionables}
      >
        <div className="w-full flex flex-col pt-2">
          <Table
            className="mt-2"
            filteringOptions={filteringOptions}
            enableSearch
            handleSearch={console.log}
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
            <Table.Body>
              {users}
              {invites}
            </Table.Body>
          </Table>
          <div>
            <span className="inter-small-regular text-grey-50">
              {users.filter(usr => !usr.token).length} member
              {users.length === 1 ? "" : "s"}
            </span>
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
  )
}

export default Users
