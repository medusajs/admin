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
          <Table.HeadCell className="ml-large min-w-[140px] max-w-[140px]">
            <span>Image</span>
          </Table.HeadCell>
        ),
        collapse: true,
        accessor: "url",
        Cell: ({ cell: { value } }) => {
          return (
            <Table.Cell className="py-base ml-large">
              <img
                className="h-[80px] w-[80px] object-cover rounded"
                src={value}
              />
            </Table.Cell>
          )
        },
      },
      {
        Header: () => (
          <Table.HeadCell>
            <span>File name</span>
          </Table.HeadCell>
        ),
        accessor: "name",
        Cell: ({ cell }) => {
          return (
            <Table.Cell className="w-full">
              <p className="inter-small-regular">{cell.row.original?.name}</p>
              {cell.row.original?.size && (
                <span className="inter-small-regular text-grey-50">
                  {(cell.row.original.size / 1024).toFixed(2)} KB
                </span>
              )}
            </Table.Cell>
          )
        },
      },
      {
        Header: () => (
          <Table.HeadCell className="flex gap-x-[6px] items-center">
            <span>Thumbnail</span>
            <IconTooltip content="Select which image you want to use as the thumbnail for this product" />
          </Table.HeadCell>
        ),
        id: "thumbnail",
        collapse: true,
        Cell: ({ cell }) => {
          return (
            <Table.Cell className="h-full w-full">
              <div className="flex items-center justify-center">
                <RadioGroup.Dot value={cell.row.index} />
              </div>
            </Table.Cell>
          )
        },
      },
      {
        Header: () => null,
        id: "delete",
        Cell: ({ row }) => {
          return (
            <Table.Cell>
              <Button
                onClick={() => onDelete(row.index)}
                variant="ghost"
                size="small"
                className="p-1 text-grey-40 cursor-pointer mx-6"
                type="button"
              >
                <TrashIcon size={20} />
              </Button>
            </Table.Cell>
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
            {headerGroup.headers.map((col, index) => {
              return col.render("Header", { index })
            })}
          </Table.HeadRow>
        ))}
      </Table.Head>
      <Table.Body {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row)
          return (
            <Table.Row {...row.getRowProps()} className="px-base" key={index}>
              {row.cells.map((cell, index) => {
                return cell.render("Cell", { key: index })
              })}
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default ImageTable
