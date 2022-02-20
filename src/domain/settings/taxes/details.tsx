import {
  useAdminRegion,
  useAdminUpdateRegion,
  useAdminTaxRates,
} from "medusa-react"
import clsx from "clsx"
import React, { useEffect, useState } from "react"
import { useTable } from "react-table"
import Spinner from "../../../components/atoms/spinner"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import Table from "../../../components/molecules/table"
import BodyCard from "../../../components/organisms/body-card"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import useNotification from "../../../hooks/use-notification"
import useTaxRateColumns from "./use-tax-rate-columns"
import { getErrorMessage } from "../../../utils/error-messages"

type TaxRate = {
  id: string
  name?: string
  rate: number | null
  code: string | null
  type: "region" | "rate"
}

const TaxDetails = ({ id, onDelete, handleSelect }) => {
  if (!id) {
    return null
  }

  const [tableEntries, setTableEntries] = useState<TaxRate[]>([])
  const notification = useNotification()

  const { tax_rates, isLoading: taxRatesLoading } = useAdminTaxRates({
    region_id: id,
  })
  const { region, isLoading: regionIsLoading } = useAdminRegion(id)
  const updateRegion = useAdminUpdateRegion(id)

  const [showDanger, setShowDanger] = useState(false)

  useEffect(() => {
    if (!taxRatesLoading && !regionIsLoading && region && tax_rates) {
      const regionDefaultRate = {
        id: region.id,
        name: "Default",
        code: region.tax_code ?? null,
        rate: region.tax_rate ?? null,
        type: "region",
      }

      console.log(tax_rates, region)

      setTableEntries([
        regionDefaultRate,
        ...tax_rates.map((tr) => {
          return {
            id: tr.id,
            name: tr.name,
            code: tr.code,
            rate: tr.rate,
            type: "rate",
          }
        }),
      ])
    }
  }, [taxRatesLoading, regionIsLoading, region, tax_rates])

  const [columns] = useTaxRateColumns()

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: tableEntries || [],
    manualPagination: true,
    autoResetPage: false,
  })

  return (
    <>
      <BodyCard
        title="Details"
        actionables={[
          {
            label: "New Tax Rate",
            onClick: console.log,
            icon: <PlusIcon />,
          },
        ]}
      >
        <Table
          {...getTableProps()}
          className={clsx({ ["relative"]: regionIsLoading })}
        >
          <Table.Head>
            {headerGroups?.map((headerGroup, index) => (
              <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((col, headerIndex) => (
                  <Table.HeadCell {...col.getHeaderProps()}>
                    {col.render("Header")}
                  </Table.HeadCell>
                ))}
              </Table.HeadRow>
            ))}
          </Table.Head>
          {regionIsLoading || taxRatesLoading ? (
            <div className="flex w-full h-full absolute items-center justify-center mt-10">
              <div className="">
                <Spinner size={"large"} variant={"secondary"} />
              </div>
            </div>
          ) : (
            <Table.Body {...getTableBodyProps()}>
              {rows.map((row, rowIndex) => {
                prepareRow(row)
                return (
                  <Table.Row
                    color={"inherit"}
                    forceDropdown
                    actions={[
                      {
                        label: "Edit",
                        onClick: (e) => console.log(row.original),
                        icon: <EditIcon size={20} />,
                      },
                    ]}
                    {...row.getRowProps()}
                    className="group"
                  >
                    {row.cells.map((cell, index) => {
                      return cell.render("Cell", { index })
                    })}
                  </Table.Row>
                )
              })}
            </Table.Body>
          )}
        </Table>
      </BodyCard>
      {showDanger && (
        <DeletePrompt
          handleClose={() => setShowDanger(!showDanger)}
          text="Are you sure you want to delete this region from your Medusa Store?"
          heading="Delete region"
          onDelete={handleDelete}
          successText="Successfully deleted region"
          confirmText="Yes, delete"
        />
      )}
    </>
  )
}

export default TaxDetails
