import { SalesChannel } from "@medusajs/medusa"
import React, { useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"
// import Button from "../../fundamentals/button"
// import PlusIcon from "../../fundamentals/icons/plus-icon"
// import IndeterminateCheckbox from "../../molecules/indeterminate-checkbox"
// import { LayeredModalContext } from "../../molecules/modal/layered-modal"
// import Table, { TablePagination } from "../../molecules/table"
// import { useAddChannelsModalScreen } from "./add-channels-modal-screen"
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

// const TableActions = ({
//   selectedRowIds,
//   chosenSalesChannelIds,
//   onAddSalesChannelsToSelected,
//   onDeselect,
//   onRemove,
// }) => {
//   const addChannelModalScreen = useAddChannelsModalScreen(
//     chosenSalesChannelIds,
//     onAddSalesChannelsToSelected
//   )
//   const { push } = React.useContext(LayeredModalContext)

//   return (
//     <div className="flex space-x-xsmall">
//       {selectedRowIds?.length ? (
//         <div className="divide-x flex items-center">
//           <span className="mr-3 inter-small-regular text-grey-50">
//             {selectedRowIds?.length} selected
//           </span>
//           <div className="flex space-x-xsmall pl-3">
//             <Button
//               onClick={onDeselect}
//               size="small"
//               variant="ghost"
//               className="border border-grey-20"
//             >
//               Deselect
//             </Button>
//             <Button
//               onClick={onRemove}
//               size="small"
//               variant="ghost"
//               className="border border-grey-20 text-rose-50"
//             >
//               Remove
//             </Button>
//           </div>
//         </div>
//       ) : (
//         <Button
//           size="small"
//           variant="ghost"
//           className="border border-grey-20"
//           onClick={() => push(addChannelModalScreen)}
//         >
//           <PlusIcon size={20} /> Add Channels
//         </Button>
//       )}
//     </div>
//   )
// }

// export const SalesChannelAvailabilityTable = ({
//   salesChannels,
//   limit,
//   offset,
//   setOffset,
//   setQuery,
//   tableState,
//   setSelectedRowIds = undefined,
//   tableAction = undefined,
// }) => {
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     rows,
//     prepareRow,
//     canPreviousPage,
//     canNextPage,
//     pageCount,
//     nextPage,
//     previousPage,
//     // Get the state from the instance
//     state: { pageIndex, pageSize, ...state },
//   } = tableState

//   const paginate = (direction: 1 | -1) => {
//     if (direction > 0) {
//       setOffset(offset + limit)
//     } else {
//       setOffset(Math.max(offset - limit, 0))
//     }
//   }

//   React.useEffect(() => {
//     if (setSelectedRowIds) {
//       setSelectedRowIds(Object.keys(state.selectedRowIds))
//     }
//   }, [Object.keys(state.selectedRowIds).length])

//   const handleNext = () => {
//     if (canNextPage) {
//       paginate(1)
//       nextPage()
//     }
//   }

//   const handlePrev = () => {
//     if (canPreviousPage) {
//       paginate(-1)
//       previousPage()
//     }
//   }
//   return (
//     <>
//       <Table
//         {...getTableProps()}
//         enableSearch
//         handleSearch={setQuery}
//         tableActions={tableAction}
//       >
//         <Table.Head>
//           {headerGroups?.map((headerGroup) => (
//             <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
//               {headerGroup.headers.map((col) => (
//                 <Table.HeadCell
//                   className="min-w-[100px]"
//                   {...col.getHeaderProps()}
//                 >
//                   {col.render("Header")}
//                 </Table.HeadCell>
//               ))}
//             </Table.HeadRow>
//           ))}
//         </Table.Head>
//         <Table.Body {...getTableBodyProps()}>
//           {rows.map((row) => {
//             prepareRow(row)
//             return (
//               <Table.Row
//                 color={"inherit"}
//                 // linkTo={`/a/products/${product.id}`}
//                 {...row.getRowProps()}
//               >
//                 {row.cells.map((cell, index) => {
//                   return (
//                     <Table.Cell {...cell.getCellProps()}>
//                       {cell.render("Cell", { index })}
//                     </Table.Cell>
//                   )
//                 })}
//               </Table.Row>
//             )
//           })}
//         </Table.Body>
//       </Table>
//       <TablePagination
//         count={salesChannels.length!}
//         limit={limit}
//         offset={offset}
//         pageSize={offset + rows.length}
//         title="Sales Channels"
//         currentPage={pageIndex + 1}
//         pageCount={pageCount}
//         nextPage={handleNext}
//         prevPage={handlePrev}
//         hasNext={canNextPage}
//         hasPrev={canPreviousPage}
//       />
//     </>
//   )
// }

export default AvailableChannelsModalScreen
