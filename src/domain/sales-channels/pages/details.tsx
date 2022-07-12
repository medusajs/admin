import React, { useState } from "react"
import { Link } from "gatsby"
import clsx from "clsx"

import { SalesChannel } from "@medusajs/medusa"
import { useAdminSalesChannels } from "medusa-react"

import AddSalesChannelModal from "../form/add-sales-channel"
import ArrowLeftIcon from "../../../components/fundamentals/icons/arrow-left-icon"
import SearchIcon from "../../../components/fundamentals/icons/search-icon"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import Actionables from "../../../components/molecules/actionables"
import EditSalesChannel from "../form/edit-sales-channel"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import {
  SalesChannelProductsSelectModal,
  SalesChannelProductsTable,
} from "../tables/product"

const mockChannels = [
  {
    name: "Default sales channel",
    description: "Main (default) sales channel",
    id: "id_1",
    is_disabled: false,
  },
  {
    name: "POS channel",
    description: "Store channel",
    id: "id_2",
    is_disabled: false,
  },
  {
    name: "FB marketplace",
    description: "Facebook and instagram marketplace sales channel",
    id: "id_3",
    is_disabled: true,
  },
]

function Indicator(props: { isActive: boolean }) {
  const { isActive } = props
  return (
    <div
      className={clsx(
        "flex justify-center items-center w-[18px] h-[18px] bg-white border rounded-circle",
        {
          "border-2 border-violet-60": isActive,
        }
      )}
    >
      {isActive && (
        <div className="w-[10px] h-[10px] bg-violet-60 rounded-circle" />
      )}
    </div>
  )
}

function SalesChannelTile(props: {
  salesChannel: SalesChannel
  isSelected: boolean
  onClick: () => void
}) {
  const { salesChannel, isSelected, onClick } = props

  return (
    <div
      onClick={onClick}
      className={clsx("mb-2 p-4 cursor-pointer rounded-lg border flex gap-2", {
        "border-2 border-violet-60": isSelected,
      })}
    >
      <Indicator isActive={isSelected} />
      <div>
        <h3 className="font-semibold text-grey-90 leading-5 mb-1">
          {salesChannel.name}
        </h3>
        <span className="text-small text-grey-50">
          {salesChannel.description}
        </span>
      </div>
    </div>
  )
}

function SalesChannelsHeader(props: { openCreateModal: () => void }) {
  const { openCreateModal } = props
  return (
    <>
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-semibold text-xlarge text-grey-90">
          Sales Channels
        </h2>
        <div className="flex justify-between items-center gap-4">
          <SearchIcon size={15} />
          <PlusIcon
            size={15}
            onClick={openCreateModal}
            className="cursor-pointer"
          />
        </div>
      </div>
      <div className="text-grey-50 text-small mb-6">
        Control which products are available in which channels
      </div>
    </>
  )
}

function SalesChannelsList(props: {
  activeChannelId: string
  openCreateModal: () => void
  setActiveSalesChannel: (salesChannel: SalesChannel) => void
}) {
  const { activeChannelId, openCreateModal, setActiveSalesChannel } = props

  // const { sales_channels } =  useAdminSalesChannels()
  const sales_channels = mockChannels

  return (
    <div className="col-span-1 rounded-lg border bg-grey-0 border-grey-20 px-8 py-6">
      <SalesChannelsHeader openCreateModal={openCreateModal} />
      <div>
        {sales_channels?.map((s) => (
          <SalesChannelTile
            salesChannel={s}
            isSelected={activeChannelId === s.id}
            onClick={() => setActiveSalesChannel(s)}
          />
        ))}
      </div>
    </div>
  )
}

function SalesChannelDetailsHeader(props: {
  salesChannel: SalesChannel
  openUpdateModal: () => void
}) {
  const { salesChannel, openUpdateModal } = props

  const [showDelete, setShowDelete] = useState()
  const [showAddProducts, setShowADdProducts] = useState(false)

  const actions = [
    {
      label: "Edit general info",
      icon: <EditIcon size="20" />,
      onClick: openUpdateModal,
    },
    {
      label: "Add/Edit products",
      icon: <PlusIcon />,
      onClick: () => setShowADdProducts(true),
    },
    {
      label: "Delete sales channel",
      icon: <TrashIcon size={20} />,
      variant: "danger",
      onClick: () => setShowDelete(true),
    },
  ]

  return (
    <div className="flex justify-between items-center">
      <h2 className="font-semibold text-xlarge text-grey-90 mb-4">
        {salesChannel.name}
      </h2>
      <Actionables forceDropdown={true} actions={actions} />

      {showAddProducts && (
        <SalesChannelProductsSelectModal
          handleClose={() => setShowADdProducts(false)}
        />
      )}

      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(false)}
          // onDelete={async () => onDelete()}
          confirmText="Yes, delete"
          successText="Sales channel deleted"
          text={`Are you sure you want to delete "${salesChannel.name}" sales channel?`}
          heading="Delete sales channel"
        />
      )}
    </div>
  )
}

function SalesChannelDetails(props: { salesChannel: SalesChannel }) {
  const { salesChannel } = props
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const openUpdateModal = () => setShowUpdateModal(true)
  const closeUpdateModal = () => setShowUpdateModal(false)

  return (
    <div className="col-span-2 rounded-rounded border bg-grey-0 border-grey-20 px-8 py-6">
      <SalesChannelDetailsHeader
        salesChannel={salesChannel}
        openUpdateModal={openUpdateModal}
      />

      <SalesChannelProductsTable />

      {showUpdateModal && (
        <EditSalesChannel
          handleClose={closeUpdateModal}
          salesChannel={salesChannel}
        />
      )}
    </div>
  )
}

function Details() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [
    activeSalesChannel,
    setActiveSalesChannel,
  ] = useState<SalesChannel | null>(mockChannels[0])

  const openCreateModal = () => setShowCreateModal(true)
  const closeCreateModal = () => setShowCreateModal(false)

  return (
    <div>
      <Link to={"/a/settings"}>
        <div className="flex text-grey-40 hover:text-purple-600 gap-2 items-center mb-2">
          <ArrowLeftIcon />
          <span className="text-small">Back to Settings</span>
        </div>
      </Link>

      <div className="grid grid-cols-3 gap-2 min-h-[960px] w-full">
        <SalesChannelsList
          openCreateModal={openCreateModal}
          activeChannelId={activeSalesChannel?.id}
          setActiveSalesChannel={setActiveSalesChannel}
        />
        <SalesChannelDetails
          salesChannel={mockChannels.find(
            (c) => c.id === activeSalesChannel.id
          )}
        />
      </div>

      {showCreateModal && <AddSalesChannelModal onClose={closeCreateModal} />}
    </div>
  )
}

export default Details
