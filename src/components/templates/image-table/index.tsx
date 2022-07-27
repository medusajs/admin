import React, { useMemo } from "react"
import { Column, useTable } from "react-table"
import { FormImage } from "../../../types/shared"
import Button from "../../fundamentals/button"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import IconTooltip from "../../molecules/icon-tooltip"
import Table from "../../molecules/table"
import RadioGroup from "../../organisms/radio-group"

export type ImageTableDataType = { id?: string } & FormImage

type ImageTableProps = {
  data: ImageTableDataType[]
  onDelete: (index: number) => void
}

const ImageTable = ({ data, onDelete }: ImageTableProps) => {
  const columns = useMemo<
    Column<{ id?: string | undefined } & FormImage>[]
  >(() => {
    return [
      {
        Header: () => (
          <div className="ml-large min-w-[140px] max-w-[140px]">
            <span>Image</span>
          </div>
        ),
        collapse: true,
        accessor: "url",
        Cell: ({ cell: { value } }) => {
          return (
            <div className="py-base ml-large">
              <img
                className="h-[80px] w-[80px] object-cover rounded"
                src={value}
              />
            </div>
          )
        },
      },
      {
        Header: () => <span>File name</span>,
        accessor: "name",
        Cell: ({ cell }) => {
          return (
            <div className="w-full">
              <p className="inter-small-regular">{cell.row.original?.name}</p>
              {cell.row.original?.size && (
                <span className="inter-small-regular text-grey-50">
                  {(cell.row.original.size / 1024).toFixed(2)} KB
                </span>
              )}
            </div>
          )
        },
      },
      {
        Header: () => (
          <div className="flex gap-x-[6px] items-center">
            <span>Thumbnail</span>
            <IconTooltip content="Select which image you want to use as the thumbnail for this product" />
          </div>
        ),
        id: "thumbnail",
        collapse: true,
        Cell: ({ cell }) => {
          return (
            <div className="flex items-center justify-center h-full w-full">
              <RadioGroup.Dot value={cell.row.index} />
            </div>
          )
        },
      },
      {
        Header: () => null,
        id: "delete",
        Cell: ({ row }) => {
          return (
            <Button
              onClick={() => onDelete(row.index)}
              variant="ghost"
              size="small"
              className="p-1 text-grey-40 cursor-pointer mx-6"
              type="button"
            >
              <TrashIcon size={20} />
            </Button>
          )
        },
      },
    ]
  }, [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  return (
    <Table {...getTableProps()}>
      <Table.Head>
        {headerGroups?.map((headerGroup) => (
          <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((col) => {
              return (
                <Table.HeadCell {...col.getHeaderProps()}>
                  {col.render("Header")}
                </Table.HeadCell>
              )
            })}
          </Table.HeadRow>
        ))}
      </Table.Head>
      <Table.Body {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row)
          return (
            <Table.Row {...row.getRowProps()} className="px-base" key={index}>
              {row.cells.map((cell) => {
                return (
                  <Table.Cell {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </Table.Cell>
                )
              })}
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default ImageTable
