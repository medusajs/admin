import { useAdminSalesChannels } from "medusa-react"
import React, { useContext, useMemo, useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import { useDebounce } from "../../../../hooks/use-debounce"
import SalesChannelTable, { useSalesChannelsTableColumns } from "./table"
import { useSalesChannelsModal } from "./use-sales-channels-modal"

const LIMIT = 15

const AddScreen = () => {
  const [columns] = useSalesChannelsTableColumns()
  const [query, setQuery] = useState<string | undefined>(undefined)
  const [offset, setOffset] = useState(0)

  const deboucedQuery = useDebounce(query, 500)

  const {
    sales_channels: salesChannels,
    count,
    isLoading,
  } = useAdminSalesChannels({
    q: deboucedQuery,
    limit: LIMIT,
    offset,
  })
  const { source, onClose, onSave } = useSalesChannelsModal()

  const filteredData = React.useMemo(() => {
    const ids = source.map((channel) => channel.id) || []
    return salesChannels?.filter(({ id }) => !ids.includes(id)) || []
  }, [salesChannels, source])

  const { pop, reset } = useContext(LayeredModalContext)

  const state = useTable(
    {
      // @ts-ignore
      columns,
      data: filteredData,
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offset / LIMIT),
        pageSize: LIMIT,
      },
      autoResetPage: false,
      autoResetSelectedRows: false,
      getRowId: (row) => row.id,
      pageCount: Math.ceil((count || 0) / LIMIT),
    },
    usePagination,
    useRowSelect
  )

  const saveAndClose = () => {
    const toSave = [
      ...source,
      ...state.selectedFlatRows.map((row) => row.original),
    ]

    onSave(toSave)
    reset()
    onClose()
  }

  const saveAndGoBack = () => {
    const toSave = [
      ...source,
      ...state.selectedFlatRows.map((row) => row.original),
    ]

    onSave(toSave)
    pop()
  }

  const disableSave = useMemo(() => {
    return state.selectedFlatRows.length === 0
  }, [state.selectedFlatRows.length])

  return (
    <>
      <Modal.Content>
        <SalesChannelTable
          isLoading={isLoading}
          count={count || 0}
          limit={LIMIT}
          offset={offset}
          setOffset={setOffset}
          setQuery={setQuery}
          tableState={state}
        />
      </Modal.Content>
      <Modal.Footer>
        <div className="flex justify-end w-full space-x-xsmall">
          <Button variant="secondary" size="small" onClick={pop}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={saveAndGoBack}
            disabled={disableSave}
          >
            Save and go back
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={saveAndClose}
            disabled={disableSave}
          >
            Save and close
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export const useAddChannelsModalScreen = () => {
  const { pop } = React.useContext(LayeredModalContext)

  return {
    title: "Add Sales Channels",
    onBack: pop,
    view: <AddScreen />,
  }
}

export default AddScreen
