import React from "react"
import { useFieldArray } from "react-hook-form"
import { useTable } from "react-table"
import IconTooltip from "../../../../../../components/molecules/icon-tooltip"
import Table from "../../../../../../components/molecules/table"
import { useProductForm } from "../../../form/product-form-context"
import ProductOptions from "./product-options"
import { useCreateColumns } from "./use-create-columns"

const CreateVariants = () => {
  const { control } = useProductForm()

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "variants",
  })

  const columns = useCreateColumns({ control })

  const {
    rows,
    headerGroups,
    getTableProps,
    getTableBodyProps,
    prepareRow,
  } = useTable({
    columns,
    data: fields,
  })

  return (
    <div className="flex flex-col gap-y-xlarge">
      <ProductOptions
        createVariant={append}
        deleteVariant={remove}
        updateVariant={update}
      />
      <div>
        <div className="flex justify-center mb-base flex-col space-y-2">
          <div className="flex space-x-2">
            <h6 className="inter-base-semibold text-grey-90">Details</h6>
            <IconTooltip content="Add product options to create variants" />
          </div>
        </div>
        <Table {...getTableProps()} className="w-full table-fixed">
          <Table.Head>
            {headerGroups?.map((headerGroup) => (
              <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((col, index) => {
                  return (
                    <Table.HeadCell key={index}>
                      {col.render("Header", { index })}
                    </Table.HeadCell>
                  )
                })}
              </Table.HeadRow>
            ))}
          </Table.Head>
          <Table.Body className="w-full" {...getTableBodyProps()}>
            {rows?.map((row, i) => {
              prepareRow(row)
              return (
                <Table.Row {...row.getRowProps()} key={row.original.id}>
                  {row.cells.map((cell, j) => {
                    return (
                      <Table.Cell {...cell.getCellProps()} key={j}>
                        {cell.render("Cell", { key: j })}
                      </Table.Cell>
                    )
                  })}
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </div>
    </div>
  )
}

export default CreateVariants
