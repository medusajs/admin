import { SalesChannel } from "@medusajs/medusa"
import React, { useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"
import SalesChannelAvailabilityTable, {
  SalesChannelTableActions,
  useAvailableChannelsModalTableColumns,
} from "./sales-channel-availability-table"

type AvailableChannelsModalScreenProps = {
  availableChannels: SalesChannel[]
  setAvailableChannels: (salesChannels: SalesChannel[]) => void
}

const LIMIT = 15

const AvailableChannelsModalScreen: React.FC<AvailableChannelsModalScreenProps> = ({
  availableChannels,
  setAvailableChannels: setAvailableChannels,
}) => {
  const numPages = Math.ceil(availableChannels?.length / LIMIT)

  const [offset, setOffset] = useState(0)
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
  const [query, setQuery] = useState("")

  const [columns] = useAvailableChannelsModalTableColumns()

  const tableState = useTable(
    {
      columns,
      data: filterSalesChannels(availableChannels),
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

  function filterSalesChannels(channels: SalesChannel[]) {
    if (!query) {
      return channels
    }

    return channels.filter((ch) => {
      const filter = query.toLowerCase()
      return (
        !!ch.name.toLowerCase().match(filter) ||
        !!ch.description?.toLowerCase().match(filter)
      )
    })
  }

  const onDeselect = () => {
    setSelectedRowIds([])
    tableState.toggleAllRowsSelected(false)
  }

  const onAddSalesChannelsToAvailableChannels = (selectedSalesChannels) => {
    setAvailableChannels([...availableChannels, ...selectedSalesChannels])
    tableState.toggleAllRowsSelected(false)
  }

  const onRemove = () => {
    const remainingSalesChannels = availableChannels.filter(
      (ch) => !selectedRowIds.includes(ch.id)
    )
    setAvailableChannels(remainingSalesChannels)
    onDeselect()
  }

  return (
    <SalesChannelAvailabilityTable
      tableAction={
        <SalesChannelTableActions
          numberOfSelectedRows={selectedRowIds.length}
          availableChannelIds={availableChannels.map((sc) => sc.id)}
          onAddSalesChannelsToAvailableChannels={
            onAddSalesChannelsToAvailableChannels
          }
          onDeselect={onDeselect}
          onRemove={onRemove}
        />
      }
      salesChannels={availableChannels}
      setSelectedRowIds={setSelectedRowIds}
      limit={LIMIT}
      offset={offset}
      setOffset={setOffset}
      setQuery={setQuery}
      tableState={tableState}
    />
  )
}

export default AvailableChannelsModalScreen
