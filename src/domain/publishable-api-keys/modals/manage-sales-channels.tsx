import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { SalesChannel } from "@medusajs/medusa"
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
import BackIcon from "../../../components/fundamentals/icons/back-icon"
import SalesChannelTable from "../tables/sales-channels-table"

const LIMIT = 12

/* ****************************************** */
/* *************** ADD SCREEN *************** */
/* ****************************************** */

function AddScreen(props: {
  isEdit?: boolean
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
    { keepPreviousData: true }
  )

  const { mutateAsync: addSalesChannelsToKeyScope } =
    useAdminAddPublishableKeySalesChannelsBatch(props.keyId)

  useEffect(() => {
    if (!props.isVisible) {
      setOffset(0)
      setSearch("")
    }
  }, [props.isVisible])

  const onSave = () => {
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
      .finally(props.goBack)
  }

  return (
    <div className="flex flex-col justify-between h-[100%] p-6">
      {/* === HEADER === */}

      <div className="flex items-center justify-between">
        <h3 className="inter-large-semibold text-xl text-gray-900 flex items-center gap-2">
          <Button className="p-2" variant="secondary" onClick={props.goBack}>
            <BackIcon size={20} />
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
            onChange={setSearch}
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
          onClick={onSave}
          disabled={!Object.keys(selectedSalesChannels).length}
        >
          Save and close
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
  isEdit?: boolean
  keyId: string
  close: () => void
  goAdd: () => void
  isVisible: boolean
}) {
  const { setSelectedChannels, selectedChannels, close } = props

  const notification = useNotification()

  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState("")

  const {
    sales_channels: data = [],
    isLoading,
    count,
  } = useAdminPublishableApiKeySalesChannels(
    props.keyId,
    // { query: search, limit: LIMIT, offset },
    undefined,
    { keepPreviousData: true }
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
    }
  }, [props.isVisible])

  return (
    <div className="flex flex-col justify-between h-[100%] p-6">
      {/* === HEADER === */}

      <div className="flex items-center justify-between">
        <h3 className="inter-large-semibold text-xl text-gray-900 flex items-center gap-2">
          Remove sales channels
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
            onChange={setSearch}
          />
          {props.isEdit && (
            <Button
              className="flex-shrink-0 h-[40px]"
              variant="secondary"
              onClick={props.goAdd}
            >
              Add channels
            </Button>
          )}
        </div>

        <SalesChannelTable
          isEdit
          query={search}
          data={data}
          offset={offset}
          count={count || 0}
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
          Save and close
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
  isVisible: boolean
  setSelectedChannels: (arg: any) => void
  selectedChannels: Map<string, SalesChannel>
  isEdit?: boolean
}

/**
 * Modal for adding/removing existing PKs channels.
 */
function ManageSalesChannelsSideModal(
  props: ManageSalesChannelsSideModalProps
) {
  const {
    isEdit,
    isVisible,
    keyId,
    close,
    selectedChannels,
    setSelectedChannels,
  } = props

  const [isAddNew, setIsAddNew] = useState(false)

  return (
    <SideModal close={close} isVisible={!!isVisible}>
      <AnimatePresence>
        {!isAddNew && (
          <motion.div
            style={{ height: "100%" }}
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -520 }}
          >
            <EditScreen
              key="edit"
              close={close}
              keyId={keyId}
              isEdit={isEdit}
              isVisible={isVisible}
              goAdd={() => setIsAddNew(true)}
              selectedChannels={selectedChannels}
              setSelectedChannels={setSelectedChannels}
            />
          </motion.div>
        )}
        {isAddNew && (
          <motion.div
            key="add"
            style={{ height: "100%" }}
            initial={{ opacity: 0, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 520 }}
          >
            <AddScreen
              close={close}
              keyId={keyId}
              isEdit={isEdit}
              isVisible={isVisible}
              goBack={() => setIsAddNew(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SideModal>
  )
}

export default ManageSalesChannelsSideModal
