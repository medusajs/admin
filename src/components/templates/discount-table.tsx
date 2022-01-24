import React, { useContext, useEffect, useState } from "react"
import useMedusa from "../../hooks/use-medusa"
import EditIcon from "../fundamentals/icons/edit-icon"
import TrashIcon from "../fundamentals/icons/trash-icon"
import StatusDot from "../fundamentals/status-dot"
import Table from "../molecules/table"
import Medusa from "../../services/api"
import DeletePrompt from "../organisms/delete-prompt"
import { navigate } from "gatsby"
import DuplicateIcon from "../fundamentals/icons/duplicate-icon"
import Badge from "../fundamentals/badge"
import Spinner from "../atoms/spinner"
import qs from "qs"
import { InterfaceContext } from "../../context/interface"
import { parse, end } from "iso8601-duration"
import { displayAmount } from "../../utils/prices"
import { getErrorMessage } from "../../utils/error-messages"

const getDiscountStatus = (discount) => {
  if (!discount.disabled) {
    const date = new Date()
    if (new Date(discount.starts_at) > date) {
      return <StatusDot title="Scheduled" variant="warning" />
    } else if (
      (discount.ends_at && new Date(discount.ends_at) < date) ||
      (discount.valid_duration &&
        date >
          end(parse(discount.valid_duration), new Date(discount.starts_at))) ||
      discount.usage_count === discount.usage_limit
    ) {
      return <StatusDot title="Expired" variant="danger" />
    } else {
      return <StatusDot title="Active" variant="success" />
    }
  }
  return <StatusDot title="Draft" variant="primary" />
}

const getDiscountAmount = (discount) => {
  switch (discount.rule.type) {
    case "fixed":
      if (!discount.regions?.length) {
        return ""
      }
      return `${displayAmount(
        discount.regions[0].currency_code,
        discount.rule.value
      )} ${discount.regions[0].currency_code.toUpperCase()}`
    case "percentage":
      return `${discount.rule.value}%`
    case "free_shipping":
      return "Free Shipping"
    default:
      return ""
  }
}

const DiscountTable: React.FC = () => {
  const [deleteDiscount, setDeleteDiscount] = useState(undefined)

  const filtersOnLoad = qs.parse(
    window.location.search.charAt(0) === "?"
      ? window.location.search.slice(1, window.location.search.length)
      : window.location.search
  )

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 20
  }

  const {
    discounts,
    refresh,
    isReloading,
    isLoading,
    count,
    toaster,
    ...rest
  } = useMedusa("discounts", {
    search: {
      is_dynamic: "false",
      ...filtersOnLoad,
    },
  })

  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(filtersOnLoad.limit || 20)
  const [offset, setOffset] = useState(filtersOnLoad.offset || 0)

  const searchQuery = (customQuery = {}) => {
    setOffset(0)
    const baseUrl = qs.parse(window.location.href).url

    const queryParts = {
      offset: 0,
      limit: 20,
      ...customQuery,
    }

    const prepared = qs.stringify(queryParts, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.replaceState(baseUrl, "", `?${prepared}`)
    refresh({
      search: {
        ...queryParts,
      },
    })
  }

  const { setOnSearch, onUnmount } = useContext(InterfaceContext)
  useEffect(onUnmount, [])
  useEffect(() => {
    setOnSearch(searchQuery)
  }, [])

  // TODO handle pagination when designed for
  // const handlePagination = (direction) => {
  //   const updatedOffset =
  //     direction === "next"
  //       ? parseInt(offset) + parseInt(limit)
  //       : parseInt(offset) - parseInt(limit)
  //   const baseUrl = qs.parseUrl(window.location.href).url

  //   const queryParts = {
  //     q: query,
  //     offset: updatedOffset,
  //     limit,
  //     ...filtersOnLoad,
  //   }

  //   const prepared = qs.stringify(queryParts, {
  //     skipNull: true,
  //     skipEmptyString: true,
  //   })

  //   console.log("baseurl", baseUrl)
  //   window.history.replaceState(baseUrl, "", `?${prepared}`)

  //   refresh({
  //     search: {
  //       ...queryParts,
  //       is_dynamic: showDynamic,
  //     },
  //   }).then(() => {
  //     setOffset(updatedOffset)
  //   })
  // }

  const duplicateDiscount = (discount) => {
    setLoading(true)
    const newRule = {
      description: discount.rule.description,
      type: discount.rule.type,
      value: discount.rule.value,
      allocation: discount.rule.allocation,
      valid_for: discount.rule.valid_for.map((product) => product.id),
    }
    const newDiscount = {
      code: `${discount.code} DUPLICATE`,
      is_dynamic: discount.isDynamic,
      rule: newRule,
      starts_at: discount.starts_at,
      ends_at: discount.ends_at,
      regions: discount.regions.map((region) => region.id),
      valid_duration: discount.valid_duration,
      usage_limit: discount.usage_limit,
      is_disabled: discount.is_disabled,
      metadata: discount.metadata,
    }

    Medusa.discounts
      .create(newDiscount)
      .then(() => {
        toaster("Successfully created discount", "success")
        handleCheckbox()
      })
      .catch((error) => {
        toaster(getErrorMessage(error), "error")
      })
      .finally(() => setLoading(false))
  }

  const filteringOptions = [
    {
      title: "Type",
      options: [
        {
          title: "All",
          count: count,
          onClick: () => searchQuery(),
        },
        {
          title: "Percentage",
          onClick: () => searchQuery({ rule: { type: "percentage" } }),
        },
        {
          title: "Fixed Amount",
          onClick: () =>
            searchQuery({ rule: { type: "fixed" }, is_dynamic: false }),
        },
        {
          title: "Dynamic",
          onClick: () => {
            searchQuery({ is_dynamic: true })
          },
        },
      ],
    },
    {
      title: "Status",
      options: [
        {
          title: "All",
          count: count,
          onClick: () => searchQuery(),
        },
        {
          title: "Active",
          count: 0,
          onClick: () => {},
        },
        {
          title: "Draft",
          count: 0,
          onClick: () => {},
        },
        {
          title: "Expired",
          count: 0,
          onClick: () => {},
        },
        {
          title: "Scheduled",
          count: 0,
          onClick: () => {},
        },
      ],
    },
  ]

  const handleDiscountSearch = (q: string) => {
    searchQuery({ q })
  }

  const getTableRow = (discount, index) => {
    return (
      <Table.Row
        key={`discount-${index}`}
        color={"inherit"}
        linkTo={`/a/discounts/${discount.id}`}
        actions={[
          {
            label: "Edit Discount",
            onClick: () => navigate(`/a/discounts/${discount.id}`),
            icon: <EditIcon size={20} />,
          },
          {
            label: "Duplicate",
            onClick: () => duplicateDiscount(discount),
            icon: <DuplicateIcon size={20} />,
          },
          {
            label: "Delete",
            variant: "danger",
            onClick: (e) => {
              setDeleteDiscount(discount)
            },
            icon: <TrashIcon size={20} />,
          },
        ]}
      >
        <Table.Cell>
          <Badge variant="code">
            <span className="inter-small-regular">{discount.code}</span>
          </Badge>
        </Table.Cell>
        <Table.Cell>{discount.rule.description}</Table.Cell>
        <Table.Cell>{getDiscountAmount(discount)}</Table.Cell>
        <Table.Cell>{getDiscountStatus(discount)}</Table.Cell>
        <Table.Cell>
          {discount.rule.valid_for.length ? (
            <span>
              {discount.rule.valid_for[0].title}
              <span className="text-grey-40">
                {discount.rule.valid_for?.length > 1 &&
                  ` + ${discount.rule.valid_for.length - 1} more`}
              </span>
            </span>
          ) : (
            <span>All Products</span>
          )}
        </Table.Cell>
        <Table.Cell className="text-right pr-4">
          {discount.usage_count}
        </Table.Cell>
      </Table.Row>
    )
  }

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div>
        <Table
          filteringOptions={filteringOptions}
          enableSearch
          placeholder="Search Discounts"
          handleSearch={handleDiscountSearch}
        >
          <Table.Head>
            <Table.HeadRow>
              <Table.HeadCell>Code</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell className="w-32">Amount</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Products</Table.HeadCell>
              <Table.HeadCell className="text-right pr-4">
                Redemptions
              </Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.HeadRow>
          </Table.Head>
          {!(isLoading || isReloading || !discounts || loading) && (
            <Table.Body>
              {discounts.map((d, i) => getTableRow(d, i))}
            </Table.Body>
          )}
        </Table>
        {(isLoading || isReloading || !discounts || loading) && (
          <div className="w-full pt-2xlarge flex items-center justify-center">
            <Spinner size={"large"} variant={"secondary"} />
          </div>
        )}
      </div>

      {deleteDiscount && (
        <DeletePrompt
          text={"Are you sure you want to remove this discount?"}
          heading={"Remove discount"}
          successText="Discount has been removed"
          onDelete={() =>
            Medusa.discounts.delete(deleteDiscount.id).then(() => {
              searchQuery()
            })
          }
          handleClose={() => setDeleteDiscount(undefined)}
        />
      )}

      <div className="flex w-full justify-between inter-small-regular text-grey-50">
        <span>{`${parseInt(offset) + 1} - ${
          count > parseInt(offset) + parseInt(limit)
            ? parseInt(offset) + parseInt(limit)
            : count
        } of ${count} Discounts`}</span>
        <span>{`${offset / limit + 1} of ${Math.ceil(count / limit)}`}</span>
      </div>
    </div>
  )
}

export default DiscountTable
