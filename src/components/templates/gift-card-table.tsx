import React, { useEffect, useState } from "react"
import useMedusa from "../../hooks/use-medusa"
import EditIcon from "../fundamentals/icons/edit-icon"
import RefreshIcon from "../fundamentals/icons/refresh-icon"
import TrashIcon from "../fundamentals/icons/trash-icon"
import StatusDot from "../fundamentals/status-dot"
import SidebarTeamMember from "../molecules/sidebar-team-member"
import Table from "../molecules/table"
import Medusa from "../../services/api"
import DeletePrompt from "../organisms/delete-prompt"
import EditUser from "../organisms/edit-user-modal"
import moment from "moment"

type GiftCardTableProps = {
  giftCards: any[]
  // triggerRefetch: () => void
}

const getInviteStatus = invite => {
  return new Date(invite.expires_at) < new Date() ? "expired" : "pending"
}

const GiftCardTable: React.FC<GiftCardTableProps> = ({ giftCards }) => {
  // const [elements, setElements] = useState<UserListElement[]>([])
  // const [shownElements, setShownElements] = useState<UserListElement[]>([])
  // const [selectedUser, setSelectedUser] = useState(null)
  // const [deleteUser, setDeleteUser] = useState(false)
  // const [selectedInvite, setSelectedInvite] = useState(null)
  // const { toaster } = useMedusa("store")

  // useEffect(() => {
  //   setElements([
  //     ...users.map((user, i) => ({
  //       entity: user,
  //       entityType: "user",
  //       tableElement: getUserTableRow(user, i),
  //     })),
  //   ])
  // }, [users, invites])

  // useEffect(() => {
  //   setShownElements(elements)
  // }, [elements])

  // const handleClose = () => {
  //   setDeleteUser(false)
  //   setSelectedUser(null)
  //   setSelectedInvite(null)
  // }

  const getGiftCardRow = (giftCard, index) => {
    return (
      <Table.Row
        linkTo={`/a/gift-cards/${giftCard.id}`}
        key={`giftCard-${index}`}
        color={"inherit"}
      >
        <Table.Cell className="py-2.5 w-60">{giftCard.code}</Table.Cell>
        <Table.Cell
          className="w-60"
          {...(giftCard.order && {
            linkTo: `/a/orders/${giftCard.order.id}`,
          })}
        >
          {giftCard.order && `# ${giftCard.order.display_id}`}
        </Table.Cell>
        <Table.Cell className="py-2.5 w-72">
          {(giftCard.value &&
            `${(
              ((1 + giftCard.region.tax_rate / 100) * giftCard.value) /
              100
            ).toFixed(2)} ${giftCard.region.currency_code.toUpperCase()}`) || (
            <>&nbsp;</>
          )}
        </Table.Cell>
        <Table.Cell className="py-2.5 w-64">
          {giftCard.balance ? (
            `${(
              ((1 + giftCard.region.tax_rate / 100) * giftCard.balance) /
              100
            ).toFixed(2)} ${giftCard.region.currency_code.toUpperCase()}`
          ) : (
            <StatusDot title="None" variant="danger" />
          )}
        </Table.Cell>
        <Table.Cell className="py-2.5">
          {moment(giftCard.created_at).format("MMM Do YYYY")}
        </Table.Cell>
        <Table.Cell className="py-2.5"></Table.Cell>
      </Table.Row>
    )
  }

  const filteringOptions = [
    {
      title: "Creation time",
      options: [
        {
          title: "All",
          count: 1,
          onClick: () => console.log("click"),
        },
      ],
    },
    {
      title: "Status",
      options: [
        {
          title: "All",
          count: 1,
          onClick: () => console.log("click"),
        },
        {
          title: "None",
          count: 1,
          onClick: () => console.log("click"),
        },
        {
          title: "Value left",
          count: 1,
          onClick: () => console.log("click"),
        },
      ],
    },
  ]

  const handleGiftCardSearch = (term: string) => {
    // setShownElements(
    //   elements.filter(
    //     e =>
    //       e.entity?.first_name?.includes(term) ||
    //       e.entity?.last_name?.includes(term) ||
    //       e.entity?.email?.includes(term) ||
    //       e.entity?.user_email?.includes(term)
    //   )
    // )
  }

  return (
    <div className="w-full h-full overflow-y-scroll">
      <Table
        filteringOptions={filteringOptions}
        enableSearch
        handleSearch={handleGiftCardSearch}
      >
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell>Code</Table.HeadCell>
            <Table.HeadCell>Order</Table.HeadCell>
            <Table.HeadCell>Original amount</Table.HeadCell>
            <Table.HeadCell>Amount left</Table.HeadCell>
            <Table.HeadCell>Created</Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body>
          {giftCards?.map((gc, idx) => getGiftCardRow(gc, idx))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default GiftCardTable
