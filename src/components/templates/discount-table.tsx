import React, { useContext, useEffect, useState } from "react"
import EditIcon from "../fundamentals/icons/edit-icon"
import TrashIcon from "../fundamentals/icons/trash-icon"
import StatusDot from "../fundamentals/status-indicator"
import Table from "../molecules/table"
import Medusa from "../../services/api"
import DeletePrompt from "../organisms/delete-prompt"
import { navigate } from "gatsby"
import DuplicateIcon from "../fundamentals/icons/duplicate-icon"
import Badge from "../fundamentals/badge"
import Spinner from "../atoms/spinner"
import qs from "query-string"
import { InterfaceContext } from "../../context/interface"
import { parse, end } from "iso8601-duration"
import { displayAmount } from "../../utils/prices"
import { getErrorMessage } from "../../utils/error-messages"
import { useAdminCreateDiscount, useAdminDiscounts } from "medusa-react"
import useToaster from "../../hooks/use-toaster"

const getDiscountStatus = (discount) => {
  console.log(discount)
  if (!discount.is_disabled) {
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
  return <StatusDot title="Draft" variant="default" />
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
  const toaster = useToaster()
  const [deleteDiscount, setDeleteDiscount] = useState(undefined)
  const createDiscount = useAdminCreateDiscount()
  const filtersOnLoad = qs.parse(window.location.search)

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 14
  }

  const { discounts, refetch, isLoading, count } = useAdminDiscounts({
    is_dynamic: false,
    limit: 14,
    offset: 0,
    ...filtersOnLoad,
  })

  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(filtersOnLoad.limit || 14)
  const [offset, setOffset] = useState(filtersOnLoad.offset || 0)

  const searchQuery = (customQuery = {}) => {
    setOffset(0)
    const baseUrl = qs.parse(window.location.href).url

    const queryParts = {
      offset: 0,
      limit: 14,
      ...customQuery,
    }

    const prepared = qs.stringify(queryParts, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.replaceState(baseUrl, "", `?${prepared}`)
    refetch({
      ...queryParts,
    })
  }

  const { setOnSearch, onUnmount } = useContext(InterfaceContext)
  useEffect(onUnmount, [])
  useEffect(() => {
    setOnSearch({ q: searchQuery })
  }, [])

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

    createDiscount
      .mutateAsync(newDiscount)
      .then(() => {
        toaster("Successfully created discount", "success")
      })
      .catch((error) => {
        toaster(getErrorMessage(error), "error")
      })
      .finally(() => setLoading(false))
  }

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
          <Badge variant="default">
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
          {!(isLoading || !discounts || loading) && (
            <Table.Body>
              {discounts.map((d, i) => getTableRow(d, i))}
            </Table.Body>
          )}
        </Table>
        {(isLoading || !discounts || loading) && (
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

      <div className="flex w-full mt-8 justify-between inter-small-regular text-grey-50">
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
