import { useAdminProducts } from "medusa-react"
import moment from "moment"
import React, { useEffect, useMemo, useState } from "react"
import { usePagination, useTable, useSortBy } from "react-table"
import { computeShippingTotal } from "../../../utils/totals"
// import { useDebounce } from "../../hooks/use-debounce"
import Spinner from "../../atoms/spinner"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"
import DuplicateIcon from "../../fundamentals/icons/duplicate-icon"
import EditIcon from "../../fundamentals/icons/edit-icon"
import StatusIndicator from "../../fundamentals/status-indicator"
import Table, { TablePagination } from "../../molecules/table"
import ImagePlaceholder from "../../fundamentals/image-placeholder"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import { navigate } from "gatsby"
import useToaster from "../../../hooks/use-toaster"
import Medusa from "../../../services/api"
import PublishIcon from "../../fundamentals/icons/publish-icon"
import { getErrorMessage } from "../../../utils/error-messages"
import DeletePrompt from "../../organisms/delete-prompt"
import ListIcon from "../../fundamentals/icons/list-icon"
import TileIcon from "../../fundamentals/icons/tile-icon"
import clsx from "clsx"

const getProductStatusVariant = (title) => {
  switch (title) {
    case "proposed":
      return "warning"
    case "published":
      return "success"
    case "rejected":
      return "danger"
    case "draft":
    default:
      return "default"
  }
}

type ProductTableProps = {}

const ProductTable: React.FC<ProductTableProps> = () => {
  const [offset, setOffset] = useState(0)
  const [deleteProduct, setDeleteProduct] = useState(undefined)
  const [limit, setLimit] = useState(14)
  const [query, setQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [numPages, setNumPages] = useState(0)
  const [showList, setShowList] = useState(true)
  const toaster = useToaster()

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">
              <div className="w-[38px] h-[38px] mr-4">
                {original.thumbnail ? (
                  <img
                    src={original.thumbnail}
                    className="h-full object-contain rounded-soft"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              {original.title}
            </div>
          )
        },
      },
      {
        Header: "Collection",
        accessor: "collection", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => {
          return <div>{value?.title || "-"}</div>
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }) => (
          <StatusIndicator
            title={`${value.charAt(0).toUpperCase()}${value.slice(1)}`}
            variant={getProductStatusVariant(value)}
          />
        ),
      },
      {
        Header: "Inventory",
        accessor: "variants",
        Cell: ({ cell: { value } }) => (
          <div>
            {value.reduce((acc, next) => acc + next.inventory_quantity, 0)}
            {" in stock for "}
            {value.length} variant(s)
          </div>
        ),
      },
      {
        accessor: "col",
        Header: "Total Sales",
      },
      {
        Header: "Total Revenue",
        accessor: "col-2",
      },
      {
        accessor: "col-3",
        Header: (
          <div className="text-right flex justify-end">
            <span
              // onClick={() => setShowList(true)}
              className={clsx("hover:bg-grey-5 cursor-pointer p-0.5", {
                "text-grey-90": showList,
                "text-grey-40": !showList,
              })}
            >
              <ListIcon size={20} />
            </span>
            <span
              // onClick={() => setShowList(false)}
              className={clsx("hover:bg-grey-5 cursor-pointer p-0.5", {
                "text-grey-90": !showList,
                "text-grey-40": showList,
              })}
            >
              <TileIcon size={20} />
            </span>
          </div>
        ),
      },
    ],
    []
  )

  const {
    products,
    isLoading,
    refetch,
    isRefetching,
    count,
  } = useAdminProducts({
    q: query,
    limit,
    offset,
  })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: products || [],
      manualPagination: true,
      initialState: {
        pageIndex: currentPage,
        pageSize: limit,
      },
      pageCount: numPages,
      autoResetPage: false,
    },
    usePagination
  )

  useEffect(() => {
    const controlledPageCount = Math.ceil(count! / limit)
    setNumPages(controlledPageCount)
  }, [products])

  const handleNext = () => {
    if (canNextPage) {
      setOffset((old) => old + pageSize)
      setCurrentPage((old) => old + 1)
      nextPage()
    }
  }

  const handlePrev = () => {
    if (canPreviousPage) {
      setOffset((old) => old - pageSize)
      setCurrentPage((old) => old - 1)
      previousPage()
    }
  }

  // Upon searching, we always start on first oage
  const handleSearch = (q) => {
    setOffset(0)
    setCurrentPage(0)
    setQuery(q)
  }

  const handleCopyProduct = async (product) => {
    const copy = {
      title: `${product.title} copy`,
      description: `${product.description}`,
      handle: `${product.handle}-copy`,
    }

    copy.options = product.options.map((po) => ({
      title: po.title,
    }))

    copy.variants = product.variants.map((pv) => ({
      title: pv.title,
      inventory_quantity: pv.inventory_quantity,
      prices: pv.prices.map((price) => {
        const p = {
          amount: price.amount,
        }
        if (price.region_id) {
          p.region_id = price.region_id
        }
        if (price.currency_code) {
          p.currency_code = price.currency_code
        }

        return p
      }),
      options: pv.options.map((pvo) => ({ value: pvo.value })),
    }))

    if (product.type) {
      copy.type = {
        id: product.type.id,
        value: product.type.value,
      }
    }

    if (product.collection_id) {
      copy.collection_id = product.collection_id
    }

    if (product.tags) {
      copy.tags = product.tags.map(({ id, value }) => ({ id, value }))
    }

    if (product.thumbnail) {
      copy.thumbnail = product.thumbnail
    }

    try {
      const { data } = await Medusa.products.create(copy)
      navigate(`/a/products/${data.product.id}`)
    } catch (error) {
      toaster(getErrorMessage(error), "error")
    }
  }

  const getActionablesForProduct = (product) => {
    return [
      {
        label: "Edit",
        onClick: () => navigate(`/a/products/${product.id}`),
        icon: <EditIcon size={20} />,
      },
      {
        label: product.status === "published" ? "Unpublish" : "Publish",
        onClick: () =>
          Medusa.products
            .update(product.id, {
              status: product.status === "published" ? "draft" : "published",
            })
            .then(() =>
              toaster(
                `Successfully ${
                  product.status === "published" ? "unpublished" : "published"
                } product`,
                "success"
              )
            )
            .then(() => refetch())
            .catch((err) => toaster(getErrorMessage(err), "error")),
        icon:
          product.status === "published" ? (
            <UnpublishIcon size={20} />
          ) : (
            <PublishIcon size={20} />
          ),
      },
      {
        label: "Duplicate",
        onClick: () => handleCopyProduct(product),
        icon: <DuplicateIcon size={20} />,
      },
      {
        label: "Delete",
        variant: "danger",
        onClick: () => setDeleteProduct(product),
        icon: <TrashIcon size={20} />,
      },
    ]
  }

  return (
    <div className="w-full h-full overflow-y-scroll">
      {isLoading || isRefetching || !products ? (
        <div className="w-full pt-2xlarge flex items-center justify-center">
          <Spinner size={"large"} variant={"secondary"} />
        </div>
      ) : (
        <>
          <Table
            filteringOptions={[]}
            enableSearch
            handleSearch={handleSearch}
            {...getTableProps()}
          >
            <Table.Head>
              {headerGroups?.map((headerGroup) => (
                <Table.HeadRow {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((col) => (
                    <Table.HeadCell
                      className="min-w-[100px]"
                      {...col.getHeaderProps()}
                    >
                      {col.render("Header")}
                    </Table.HeadCell>
                  ))}
                </Table.HeadRow>
              ))}
            </Table.Head>
            <Table.Body {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row)
                return (
                  <Table.Row
                    color={"inherit"}
                    linkTo={`/a/products/${row.original.id}`}
                    actions={getActionablesForProduct(row.original)}
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell, index) => {
                      return (
                        <Table.Cell {...cell.getCellProps()}>
                          {cell.render("Cell", { index })}
                        </Table.Cell>
                      )
                    })}
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>
          <TablePagination
            count={count!}
            limit={limit}
            offset={offset}
            pageSize={offset + rows.length}
            title="Customers"
            currentPage={pageIndex}
            pageCount={pageCount}
            nextPage={handleNext}
            prevPage={handlePrev}
            hasNext={canNextPage}
            hasPrev={canPreviousPage}
          />
        </>
      )}
      {deleteProduct && (
        <DeletePrompt
          handleClose={() => setDeleteProduct(undefined)}
          onDelete={() => {
            Medusa.products.delete(deleteProduct.id).then(() => refetch())
          }}
        />
      )}
    </div>
  )
}

export default ProductTable
