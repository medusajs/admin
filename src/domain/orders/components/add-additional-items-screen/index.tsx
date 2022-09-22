import { useAdminVariants } from "medusa-react"
import React, { useMemo, useState } from "react"
import { usePagination, useRowSelect, useTable } from "react-table"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import { useLayeredModal } from "../../../../components/molecules/modal/layered-modal"
import { TablePagination } from "../../../../components/molecules/table"
import { AdditionalItem } from "../items-to-send-form"
import AdditionalItemsTable from "./additional-items-table"
import useAdditionalItemsColumns from "./use-additional-items-columns"

type Props = {
  append: (items: AdditionalItem[]) => void
  selectedIds: string[]
}

const PAGE_SIZE = 12

const AddAdditionalItemsScreen = ({ append, selectedIds }: Props) => {
  const { pop } = useLayeredModal()

  const [offset, setOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const { variants, count, isLoading } = useAdminVariants({
    limit: PAGE_SIZE,
    offset,
  })

  const data = useMemo(() => {
    return variants?.filter((v) => !selectedIds.includes(v.id)) || []
  }, [variants])

  const columns = useAdditionalItemsColumns()
  const numPages = useMemo(() => {
    if (count) {
      return Math.ceil(count / PAGE_SIZE)
    }

    return 0
  }, [count])

  const tableInstance = useTable(
    {
      columns,
      data,
      manualPagination: true,
      initialState: {
        pageIndex: currentPage,
        pageSize: PAGE_SIZE,
      },
      pageCount: numPages,
      autoResetSelectedRows: false,
      autoResetPage: false,
      getRowId: (row) => row.id,
    },
    usePagination,
    useRowSelect
  )

  const {
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    rows,
    state: { pageIndex, pageSize, selectedRowIds },
  } = tableInstance

  const handleNext = () => {
    if (canNextPage) {
      setOffset((old) => old + pageSize)
      setCurrentPage((old) => old + 1)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      setOffset((old) => Math.max(old - pageSize, 0))
      setCurrentPage((old) => Math.max(old - 1, 0))
      previousPage()
    }
  }

  const onSubmit = () => {
    const selectedVariants = rows
      .filter((row) => selectedRowIds[row.id])
      .map((row) => row.original)

    const toAppend: AdditionalItem[] = selectedVariants.map((variant) => ({
      variant_id: variant.id,
      quantity: 1,
      product_title: variant.product.title,
      variant_title: variant.title,
      thumbnail: variant.product.thumbnail,
      in_stock: variant.inventory_quantity,
    }))

    append(toAppend)
    pop()
  }

  return (
    <>
      <Modal.Content>
        <AdditionalItemsTable
          instance={tableInstance}
          isLoadingData={isLoading}
        />
        <TablePagination
          count={count!}
          limit={PAGE_SIZE}
          offset={offset}
          pageSize={offset + rows.length}
          title="results"
          currentPage={pageIndex + 1}
          pageCount={pageCount}
          nextPage={handleNext}
          prevPage={handlePrev}
          hasNext={canNextPage}
          hasPrev={canPreviousPage}
        />
      </Modal.Content>
      <Modal.Footer>
        <div className="flex items-center gap-x-xsmall justify-end w-full">
          <Button variant="secondary" size="small" onClick={pop}>
            Go back
          </Button>
          <Button
            variant="primary"
            size="small"
            type="button"
            onClick={onSubmit}
          >
            Add products
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

const useAddAdditionalItemsScreen = () => {
  const { push, pop } = useLayeredModal()

  const pushScreen = (props: Props) => {
    push({
      title: "Add products",
      onBack: () => pop(),
      view: <AddAdditionalItemsScreen {...props} />,
    })
  }

  return { pushScreen }
}

export default useAddAdditionalItemsScreen
