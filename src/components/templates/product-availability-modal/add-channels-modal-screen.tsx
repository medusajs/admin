import { SalesChannel } from "@medusajs/medusa"
import { useAdminSalesChannels } from "medusa-react"
import React, { useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"
import Spinner from "../../atoms/spinner"
import Button from "../../fundamentals/button"
import Modal from "../../molecules/modal"
import { LayeredModalContext } from "../../molecules/modal/layered-modal"

import SalesChannelAvailabilityTable, {
  useAvailableChannelsModalTableColumns,
} from "./sales-channel-availability-table"

export const useAddChannelsModalScreen = (
  selectedRowIds,
  onAddSalesChannelsToSelected
) => {
  const { pop } = React.useContext(LayeredModalContext)

  return {
    title: "Add Sales Channels",
    onBack: () => pop(),
    onConfirm: () => pop(),
    view: (
      <AddChannelsModalScreen
        selectedSalesChannelIds={selectedRowIds}
        onAddSalesChannelsToSelected={onAddSalesChannelsToSelected}
      />
    ),
  }
}

type AddChannelsModalScreenProps = {
  selectedSalesChannelIds: string[]
  onAddSalesChannelsToSelected: (salesChannels: SalesChannel[]) => void
}

const AddChannelsModalScreen: React.FC<AddChannelsModalScreenProps> = ({
  onAddSalesChannelsToSelected,
  selectedSalesChannelIds,
}) => {
  const limit = 15
  const [offset, setOffset] = useState(0)
  const [query, setQuery] = useState("")
  const [freeText, setFreeText] = useState("")

  const { pop } = React.useContext(LayeredModalContext)
  const [columns] = useAvailableChannelsModalTableColumns()

  const { sales_channels: salesChannels } = useAdminSalesChannels({
    q: freeText,
  })

  const numPages = Math.ceil((salesChannels?.length || 0) / limit)

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
        pageIndex: Math.floor(offset / limit),
        pageSize: limit,
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
          salesChannels={(salesChannels as SalesChannel[]) || []}
          limit={limit}
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
            onClick={() => pop()}
          >
            Back
          </Button>
          <Button
            variant="primary"
            size="small"
            className="w-[128px]"
            onClick={() => {
              onAddSalesChannelsToSelected(
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
