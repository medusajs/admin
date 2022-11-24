import React, { useEffect, useState } from "react"
import { Row, useTable } from "react-table"
import moment from "moment"
import { debounce } from "lodash"
import { PublishableApiKey } from "@medusajs/medusa"

import {
  useAdminDeletePublishableApiKey,
  useAdminPublishableApiKeys,
  useAdminRevokePublishableApiKey,
} from "medusa-react"

import TableContainer from "../../../components/organisms/table-container"
import Table from "../../../components/molecules/table"
import { ActionType } from "../../../components/molecules/actionables"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import ClipboardCopyIcon from "../../../components/fundamentals/icons/clipboard-copy-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import StatusIndicator from "../../../components/fundamentals/status-indicator"
import StopIcon from "../../../components/fundamentals/icons/stop-icon"
import Tooltip from "../../../components/atoms/tooltip"
import CheckIcon from "../../../components/fundamentals/icons/check-icon"

const PAGE_SIZE = 12

const COLUMNS = [
  {
    accessor: "title",
    Header: <div className="text-gray-500 text-small font-semibold">Name</div>,
    Cell: ({ row: { original } }) => {
      return <span className="text-gray-900">{original.title}</span>
    },
  },
  {
    accessor: "id",
    Header: <div className="text-gray-500 text-small font-semibold">Token</div>,
    Cell: ({ row: { original } }) => {
      const [copied, setCopied] = useState(false)

      const onClick = () => {
        setCopied(true)
        navigator.clipboard.writeText(original.id)
      }

      return (
        <Tooltip
          delayDuration={300}
          onMouseLeave={debounce(() => setCopied(false), 1000)}
          content={
            copied ? (
              <span className="flex flex-row gap-1 justify-between items-center">
                <CheckIcon size={16} className="text-green-700" /> done
              </span>
            ) : (
              <span onClick={onClick} className="cursor-pointer">
                Copy to clipboard
              </span>
            )
          }
        >
          <span className="text-gray-500">{original.id}</span>
        </Tooltip>
      )
    },
  },
  {
    accessor: "created_at",
    Header: (
      <div className="text-gray-500 text-small font-semibold">Created</div>
    ),
    Cell: ({ row: { original } }) => {
      return (
        <span className="text-gray-900">
          {moment(original.created_at).format("MMM Do YYYY, h:mm:ss")}
        </span>
      )
    },
  },
  {
    accessor: "revoked_at",
    Header: (
      <div className="text-gray-500 text-small font-semibold">Status</div>
    ),
    Cell: ({ row: { original } }) => {
      return (
        <span className="text-gray-900 min-w-[50px]">
          {original.revoked_at ? (
            <StatusIndicator title="Revoked" variant="danger" />
          ) : (
            <StatusIndicator title="Live" variant="success" />
          )}
        </span>
      )
    },
  },
]

type PublishableKeyTableRowProps = {
  row: Row<PublishableApiKey>
  isRevoked: boolean
}

function PublishableKeyTableRow(props: PublishableKeyTableRowProps) {
  const { row, isRevoked } = props
  const pubKeyId = row.original.id

  const { mutateAsync: revokePublicKey } =
    useAdminRevokePublishableApiKey(pubKeyId)

  const { mutateAsync: deletePublicKey } =
    useAdminDeletePublishableApiKey(pubKeyId)

  const actions: ActionType[] = [
    {
      label: "Edit API key details",
      onClick: () => {},
      icon: <EditIcon size={16} />,
    },
    {
      label: "Copy token",
      onClick: () => navigator.clipboard.writeText(pubKeyId),
      icon: <ClipboardCopyIcon size={16} />,
    },
    {
      label: "Revoke token",
      onClick: () => revokePublicKey(),
      icon: <StopIcon size={16} />,
      disabled: isRevoked,
    },
    {
      label: "Delete API key",
      onClick: () => deletePublicKey(),
      icon: <TrashIcon size={16} />,
      variant: "danger",
    },
  ]

  return (
    <Table.Row {...props.row.getRowProps()} actions={actions}>
      {props.row.cells.map((cell) => (
        <Table.Cell {...cell.getCellProps()}>{cell.render("Cell")}</Table.Cell>
      ))}
    </Table.Row>
  )
}

/**
 * Container component that displays paginated publishable api keys table.
 */
function PublishableApiKeysTable() {
  const [offset, setOffset] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)

  const {
    publishable_api_keys: keys,
    count,
    isLoading,
  } = useAdminPublishableApiKeys()

  const table = useTable({
    columns: COLUMNS,
    data: keys || [],
    manualPagination: true,
    initialState: {
      pageIndex: currentPage,
      pageSize: PAGE_SIZE,
      selectedRowIds: {},
    },
    pageCount: numPages,
    autoResetSelectedRows: false,
    autoResetPage: false,
    getRowId: (row) => row.id,
  })

  useEffect(() => {
    if (typeof count !== "undefined") {
      setNumPages(Math.ceil(count / PAGE_SIZE))
    }
  }, [count])

  const handleNext = () => {
    if (table.canNextPage) {
      setOffset((old) => old + table.state.pageSize)
      setCurrentPage((old) => old + 1)
      table.nextPage()
    }
  }

  const handlePrev = () => {
    if (table.canPreviousPage) {
      setOffset((old) => Math.max(old - table.state.pageSize, 0))
      setCurrentPage((old) => old - 1)
      table.previousPage()
    }
  }

  return (
    <TableContainer
      hasPagination
      isLoading={isLoading}
      numberOfRows={PAGE_SIZE}
      pagingState={{
        count: count!,
        offset: offset,
        pageSize: offset + table.rows.length,
        title: "API Keys",
        currentPage: table.state.pageIndex + 1,
        pageCount: table.pageCount,
        nextPage: handleNext,
        prevPage: handlePrev,
        hasNext: table.canNextPage,
        hasPrev: table.canPreviousPage,
      }}
    >
      <Table {...table.getTableProps()}>
        {/* === HEADER === */}
        {table.headerGroups.map((headerGroup) => (
          <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((col) => (
              <Table.HeadCell {...col.getHeaderProps()}>
                {col.render("Header")}
              </Table.HeadCell>
            ))}
          </Table.HeadRow>
        ))}

        {/* === BODY === */}
        <Table.Body {...table.getTableBodyProps()}>
          {table.rows.map((row) => {
            table.prepareRow(row)
            return (
              <PublishableKeyTableRow
                row={row}
                isRevoked={!!row.original.revoked_at}
              />
            )
          })}
        </Table.Body>
      </Table>
    </TableContainer>
  )
}

export default PublishableApiKeysTable
