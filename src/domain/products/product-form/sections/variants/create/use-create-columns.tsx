import React, { useMemo } from "react"
import { Control, Controller, FieldArrayWithId } from "react-hook-form"
import { Column } from "react-table"
import GridInput from "../../../../../../components/molecules/grid-input"
import { ProductFormValues } from "../../../utils/types"

type UseCreateColunmsProps = {
  control: Control<ProductFormValues, any>
}

export const useCreateColumns = ({ control }: UseCreateColunmsProps) => {
  const columns: Column<
    FieldArrayWithId<ProductFormValues, "variants", "id">
  >[] = useMemo(() => {
    return [
      {
        Header: "Variant",
        accessor: "options",
        Cell: ({ cell: { value } }) => (
          <span>{value.map((v) => v.value).join(" / ")}</span>
        ),
      },
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ row: { index } }) => (
          <Controller
            name={`variants.${index}.title`}
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <GridInput
                  value={value ?? undefined}
                  onChange={onChange}
                  placeholder="Green_Blue"
                />
              )
            }}
          />
        ),
      },
      {
        Header: "SKU",
        accessor: "sku",
        Cell: ({ row: { index } }) => (
          <Controller
            name={`variants.${index}.sku`}
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <GridInput
                  value={value ?? undefined}
                  onChange={onChange}
                  placeholder="SUN-G, JK1234..."
                />
              )
            }}
          />
        ),
      },
      {
        Header: "EAN",
        accessor: "ean",
        Cell: ({ row: { index } }) => (
          <Controller
            name={`variants.${index}.ean`}
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <GridInput
                  value={value ?? undefined}
                  onChange={onChange}
                  placeholder="1231231231234..."
                />
              )
            }}
          />
        ),
      },
      {
        Header: "Inventory",
        accessor: "inventory_quantity",
        Cell: ({ row: { index } }) => (
          <Controller
            name={`variants.${index}.inventory_quantity`}
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <GridInput
                  value={value ?? undefined}
                  onChange={onChange}
                  placeholder="100"
                />
              )
            }}
          />
        ),
      },
    ]
  }, [control])

  return columns
}
