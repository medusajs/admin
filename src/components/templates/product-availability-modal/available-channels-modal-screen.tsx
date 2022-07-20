import { SalesChannel } from "@medusajs/medusa"
import React, { useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"
import SalesChannelAvailabilityTable, {
  SalesChannelTableActions,
  useAvailableChannelsModalTableColumns,
} from "./sales-channel-availability-table"

type AvailableChannelsModalScreenProps = {
  salesChannels: SalesChannel[]
  setSelectedSalesChannels: (salesChannels: SalesChannel[]) => void
}

const AvailableChannelsModalScreen: React.FC<AvailableChannelsModalScreenProps> = ({
  salesChannels,
  setSelectedSalesChannels,
}) => {
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

  const [columns] = useAvailableChannelsModalTableColumns()

  const limit = 15
  const [offset, setOffset] = useState(0)
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])
  const [query, setQuery] = useState("")

  const numPages = Math.ceil(salesChannels?.length / limit)
  const tableState = useTable(
    {
      columns,
      data: filterSalesChannels(salesChannels),
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

  const onDeselect = () => {
    setSelectedRowIds([])
    tableState.toggleAllRowsSelected(false)
  }

  const onAddSalesChannelsToSelected = (selectedSalesChannels) => {
    setSelectedSalesChannels([...salesChannels, ...selectedSalesChannels])
    tableState.toggleAllRowsSelected(false)
  }

  const onRemove = () => {
    const remainingSalesChannels = salesChannels.filter(
      (ch) => !selectedRowIds.includes(ch.id)
    )
    setSelectedSalesChannels(remainingSalesChannels)
    onDeselect()
  }

  // VIEW

  return (
    <SalesChannelAvailabilityTable
      tableAction={
        <SalesChannelTableActions
          selectedRowIds={selectedRowIds}
          chosenSalesChannelIds={salesChannels.map((sc) => sc.id)}
          onAddSalesChannelsToSelected={onAddSalesChannelsToSelected}
          onDeselect={onDeselect}
          onRemove={onRemove}
        />
      }
      salesChannels={salesChannels}
      setSelectedRowIds={setSelectedRowIds}
      limit={limit}
      offset={offset}
      setOffset={setOffset}
      setQuery={setQuery}
      tableState={tableState}
    />
  )
}

export default AvailableChannelsModalScreen
