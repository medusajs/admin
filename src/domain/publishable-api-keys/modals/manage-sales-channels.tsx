import React, { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"

import {
  useAdminAddPublishableKeySalesChannelsBatch,
  useAdminRemovePublishableKeySalesChannelsBatch,
  useAdminPublishableApiKeySalesChannels,
  useAdminSalesChannels,
} from "medusa-react"

import Button from "../../../components/fundamentals/button"
import SideModal from "../../../components/molecules/modal/side-modal"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import useNotification from "../../../hooks/use-notification"
import InputField from "../../../components/molecules/input"
import SearchIcon from "../../../components/fundamentals/icons/search-icon"
import SalesChannelTable from "../tables/sales-channels-table"
import UTurnIcon from "../../../components/fundamentals/icons/u-turn-icon"

const LIMIT = 12

/* ****************************************** */
/* *************** ADD SCREEN *************** */
/* ****************************************** */

function AddScreen(props: {
  keyId: string
  close: () => void
  goBack: () => void
  isVisible: boolean
}) {
  const [selectedSalesChannels, setSelectedChannels] = useState({})
  const notification = useNotification()

  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState("")

  const {
    sales_channels: data = [],
    isLoading,
    count,
  } = useAdminSalesChannels(
    { q: search, limit: LIMIT, offset },
    { keepPreviousData: true, enabled: !!props.keyId }
  )

  const { mutateAsync: addSalesChannelsToKeyScope } =
    useAdminAddPublishableKeySalesChannelsBatch(props.keyId)

  useEffect(() => {
    if (!props.isVisible) {
      setOffset(0)
      setSearch("")
      setSelectedChannels({})
    }
  }, [props.isVisible])

  const onSave = (callback: () => void) => () => {
    addSalesChannelsToKeyScope({
      sales_channel_ids: Object.keys(selectedSalesChannels).map((id) => ({
        id,
      })),
    })
      .then(() => {
        notification("Success", "Sales channels added to the scope", "success")
      })
      .catch(() => {
        notification(
          "Error",
          "Error occurred while adding sales channels to the scope of the key",
          "success"
        )
      })
      .finally(callback)
  }

  return (
    <div className="flex flex-col justify-between h-[100%] p-6">
      {/* === HEADER === */}

      <div className="flex items-center justify-between">
        <h3 className="inter-large-semibold text-xl text-gray-900 flex items-center gap-2">
          <Button className="p-2" variant="secondary" onClick={props.goBack}>
            <UTurnIcon size={20} />
          </Button>
          Add sales channels
        </h3>
        <Button variant="ghost" onClick={props.close}>
          <CrossIcon size={20} className="text-grey-40" />
        </Button>
      </div>
      {/* === DIVIDER === */}

      <div className="flex-grow">
        <div className="flex justify-between items-center gap-2">
          <InputField
            name="name"
            type="string"
            value={search}
            className="my-4 h-[40px]"
            placeholder="Find channels"
            prefix={<SearchIcon size={16} />}
            onChange={(ev) => setSearch(ev.target.value)}
          />
        </div>

        <SalesChannelTable
          isEdit
          query={search}
          data={data}
          offset={offset}
          count={count || 0}
          setOffset={setOffset}
          isLoading={isLoading}
          selectedChannels={selectedSalesChannels}
          setSelectedChannels={setSelectedChannels}
        />
      </div>
      {/* === DIVIDER === */}

      <div
        className="h-[1px] bg-gray-200 block"
        style={{ margin: "24px -24px" }}
      />
      {/* === FOOTER === */}

      <div className="flex justify-end gap-2">
        <Button size="small" variant="ghost" onClick={close}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="primary"
          onClick={onSave(props.goBack)}
          disabled={!Object.keys(selectedSalesChannels).length}
        >
          Add and go back
        </Button>
        <Button
          size="small"
          variant="primary"
          onClick={onSave(props.close)}
          disabled={!Object.keys(selectedSalesChannels).length}
        >
          Add and close
        </Button>
      </div>
    </div>
  )
}

/* ******************************************* */
/* *************** EDIT SCREEN *************** */
/* ******************************************* */

/**
 * Edit exiting PK SC list
 */
function EditScreen(props: {
  keyId: string
  close: () => void
  goAdd: () => void
  isVisible: boolean
}) {
  const { close } = props

  const [selectedChannels, setSelectedChannels] = useState({})

  const notification = useNotification()

  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState("")

  const { sales_channels: data = [], isLoading } =
    useAdminPublishableApiKeySalesChannels(
      props.keyId,
      { q: search },
      {
        keepPreviousData: true,
        enabled: !!props.keyId,
      }
    )

  const { mutateAsync: removeSalesChannelsToKeyScope } =
    useAdminRemovePublishableKeySalesChannelsBatch(props.keyId)

  const onSave = () => {
    removeSalesChannelsToKeyScope({
      sales_channel_ids: Object.keys(selectedChannels).map((id) => ({
        id,
      })),
    })
      .then(() => {
        notification(
          "Success",
          "Sales channels removed from the scope",
          "success"
        )
      })
      .catch(() => {
        notification(
          "Error",
          "Error occurred while removing sales channels from the scope of the key",
          "success"
        )
      })
      .finally(close)
  }

  useEffect(() => {
    if (!props.isVisible) {
      setOffset(0)
      setSearch("")
      setSelectedChannels({})
    }
  }, [props.isVisible])

  console.log("render")

  // virtual pagination
  const displayData = useMemo(
    () => data?.slice(offset, offset + LIMIT),
    [data, offset]
  )

  return (
    <div className="flex flex-col justify-between h-[100%] p-6">
      {/* === HEADER === */}

      <div className="flex items-center justify-between">
        <h3 className="inter-large-semibold text-xl text-gray-900 flex items-center gap-2">
          Edit sales channels
        </h3>
        <Button variant="ghost" onClick={props.close}>
          <CrossIcon size={20} className="text-grey-40" />
        </Button>
      </div>
      {/* === DIVIDER === */}

      <div className="flex-grow">
        <div className="flex justify-between items-center gap-2">
          <InputField
            name="name"
            type="string"
            value={search}
            className="my-4 h-[40px]"
            placeholder="Find channels"
            prefix={<SearchIcon size={16} />}
            onChange={(ev) => setSearch(ev.target.value)}
          />

          <Button
            className="flex-shrink-0 h-[40px]"
            variant="secondary"
            onClick={props.goAdd}
          >
            Add channels
          </Button>
        </div>

        <SalesChannelTable
          isEdit
          query={search}
          data={displayData}
          offset={offset}
          count={data.length || 0}
          setOffset={setOffset}
          isLoading={isLoading}
          selectedChannels={selectedChannels}
          setSelectedChannels={setSelectedChannels}
        />
      </div>
      {/* === DIVIDER === */}

      <div
        className="h-[1px] bg-gray-200 block"
        style={{ margin: "24px -24px" }}
      />
      {/* === FOOTER === */}

      <div className="flex justify-end gap-2">
        <Button size="small" variant="ghost" onClick={close}>
          Cancel
        </Button>
        <Button
          size="small"
          variant="primary"
          onClick={onSave}
          disabled={!Object.keys(selectedChannels).length}
        >
          Remove and close
        </Button>
      </div>
    </div>
  )
}

/* ***************************************************** */
/* *************** MANAGE CHANNELS MODAL *************** */
/* ***************************************************** */

type ManageSalesChannelsSideModalProps = {
  keyId?: string
  close: () => void
}

/**
 * Modal for adding/removing existing PKs channels.
 */
function ManageSalesChannelsSideModal(
  props: ManageSalesChannelsSideModalProps
) {
  const { keyId, close } = props

  const isVisible = !!keyId

  const [isAddNew, setIsAddNew] = useState(false)

  useEffect(() => {
    if (!isVisible) {
      setIsAddNew(false)
    }
  }, [isVisible])

  return (
    <SideModal close={close} isVisible={!!isVisible}>
      <motion.div
        style={{ width: 560 * 2, display: "flex", height: "100%" }}
        animate={{ x: isAddNew ? -560 : 0 }}
        transition={{ ease: "easeInOut" }}
      >
        {/* EDIT PANEL */}

        <motion.div
          style={{ height: "100%", width: 560 }}
          animate={{ opacity: isAddNew ? 0 : 1 }}
        >
          <EditScreen
            close={close}
            keyId={keyId!}
            isVisible={isVisible && !isAddNew}
            goAdd={() => setIsAddNew(true)}
          />
        </motion.div>
        {/* ADD PANEL */}

        <motion.div
          style={{ height: "100%", width: 560 }}
          animate={{ opacity: !isAddNew ? 0 : 1 }}
        >
          <AddScreen
            close={close}
            keyId={keyId!}
            isVisible={isVisible && isAddNew}
            goBack={() => setIsAddNew(false)}
          />
        </motion.div>
      </motion.div>
    </SideModal>
  )
}

export default ManageSalesChannelsSideModal
