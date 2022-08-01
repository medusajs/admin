import { SalesChannel } from "@medusajs/medusa"
import { useAdminSalesChannels } from "medusa-react"
import React, { useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"
import Button from "../../../../../../components/fundamentals/button"
import Modal from "../../../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../../../components/molecules/modal/layered-modal"

import SalesChannelAvailabilityTable, {
  useAvailableChannelsModalTableColumns,
} from "./sales-channel-availability-table"

export const useAddChannelsModalScreen = (
  selectedRowIds,
  onAddSelectedToAvailableChannels
) => {
  const { pop } = React.useContext(LayeredModalContext)

  return {
    title: "Add Sales Channels",
    onBack: pop,
    view: (
      <AddChannelsModalScreen
        selectedSalesChannelIds={selectedRowIds}
        onAddSelectedToAvailableChannels={onAddSelectedToAvailableChannels}
      />
    ),
  }
}

type AddChannelsModalScreenProps = {
  selectedSalesChannelIds: string[]
  onAddSelectedToAvailableChannels: (salesChannels: SalesChannel[]) => void
}

const LIMIT = 15

const AddChannelsModalScreen: React.FC<AddChannelsModalScreenProps> = ({
  onAddSelectedToAvailableChannels: onAddSelectedToAvailableChannels,
  selectedSalesChannelIds,
}) => {
  const [offset, setOffset] = useState(0)
  const [query, setQuery] = useState("")
  const [freeText, setFreeText] = useState("")

  const { pop } = React.useContext(LayeredModalContext)
  const [columns] = useAvailableChannelsModalTableColumns()

  const { sales_channels: salesChannels, count } = useAdminSalesChannels({
    q: freeText,
    limit: LIMIT,
    offset,
  })

  const numPages = Math.ceil((count || 0) / LIMIT)

  const filterSalesChannels = (salesChannels: SalesChannel[]) => {
    return salesChannels.filter((salesChannel) => {
      return !selectedSalesChannelIds.includes(salesChannel.id)
    })
  }

  const tableState = useTable(
    {
      columns,
      data: salesChannels ? filterSalesChannels(salesChannels) : [],
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offset / LIMIT),
        pageSize: LIMIT,
      },
      autoResetPage: false,
      autoResetSelectedRows: false,
      getRowId: (row) => row.id,
      pageCount: numPages,
    },
    usePagination,
    useRowSelect
  )

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFreeText(query)
      if (query) {
        tableState.gotoPage(0)
      }
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [query])

  return (
    <>
      <Modal.Content isLargeModal>
        <SalesChannelAvailabilityTable
          salesChannels={salesChannels || []}
          limit={LIMIT}
          offset={offset}
          setOffset={setOffset}
          setQuery={setQuery}
          tableState={tableState}
        />
      </Modal.Content>
      <Modal.Footer isLargeModal>
        <div className="flex justify-end w-full space-x-xsmall">
          <Button
            variant="ghost"
            size="small"
            className="w-[112px]"
            onClick={pop}
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="small"
            className="w-[128px]"
            onClick={() => {
              onAddSelectedToAvailableChannels(
                tableState.selectedFlatRows.map((row) => row.original)
              )
              pop()
            }}
          >
            Add and go back
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export default AddChannelsModalScreen
