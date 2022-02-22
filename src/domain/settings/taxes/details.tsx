import { useAdminRegion, useAdminTaxRates } from "medusa-react"
import clsx from "clsx"
import React, { useEffect, useState } from "react"
import { useTable } from "react-table"
import Spinner from "../../../components/atoms/spinner"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import Table from "../../../components/molecules/table"
import BodyCard from "../../../components/organisms/body-card"
import useTaxRateColumns from "./use-tax-rate-columns"
import NewTaxRate from "./new"
import EditTaxRate from "./edit"
import { TaxRateRow } from "./tax-rate-row"
import { RegionTaxForm } from "./region-form"
import { TaxRateType, PaginationProps } from "../../../types/shared"

type TaxRate = {
  id: string
  name?: string
  rate: number | null
  code: string | null
  type: TaxRateType
}

const DEFAULT_PAGESIZE = 10

const TaxDetails = ({ id }) => {
  if (!id) {
    return null
  }

  const [pagination, setPagination] = useState<PaginationProps>({
    limit: DEFAULT_PAGESIZE,
    offset: 0,
  })
  const [showNew, setShowNew] = useState<boolean>(false)
  const [editRate, setEditRate] = useState<TaxRate | null>(null)
  const [tableEntries, setTableEntries] = useState<TaxRate[]>([])

  const { tax_rates, isLoading: taxRatesLoading } = useAdminTaxRates({
    region_id: id,
    ...pagination,
  })

  const { region, isLoading: regionIsLoading } = useAdminRegion(id)

  useEffect(() => {
    if (!taxRatesLoading && !regionIsLoading && region && tax_rates) {
      const regionDefaultRate = {
        id: region.id,
        name: "Default",
        code: region.tax_code ?? null,
        rate: region.tax_rate ?? null,
        type: TaxRateType.REGION,
      }

      setTableEntries([
        regionDefaultRate,
        ...tax_rates.map((tr) => {
          return {
            id: tr.id,
            name: tr.name,
            code: tr.code,
            rate: tr.rate,
            type: TaxRateType.RATE,
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
            onClick: () => setShowNew(true),
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
              {rows.map((row) => {
                prepareRow(row)
                return (
                  <TaxRateRow
                    key={row.original.id}
                    onEdit={setEditRate}
                    row={row}
                  />
                )
              })}
            </Table.Body>
          )}
        </Table>
        <h3 className="inter-large-semibold mt-2xlarge mb-base">
          Tax Calculation Settings
        </h3>
        <div className="flex flex-1">
          {!regionIsLoading && <RegionTaxForm region={region} />}
        </div>
      </BodyCard>
      {showNew && (
        <NewTaxRate regionId={id} onDismiss={() => setShowNew(false)} />
      )}
      {editRate && (
        <EditTaxRate
          regionId={id}
          taxRate={editRate}
          taxRateId={editRate.id}
          onDismiss={() => setEditRate(null)}
        />
      )}
    </>
  )
}

export default TaxDetails
