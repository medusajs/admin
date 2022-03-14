import { end, parse } from "iso8601-duration"
import React, { useMemo } from "react"
import { formatAmountWithSymbol } from "../../../utils/prices"
import Badge from "../../fundamentals/badge"
import StatusDot from "../../fundamentals/status-indicator"
import Table from "../../molecules/table"

const getDiscountStatus = (discount) => {
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
  return <StatusDot title="Disabled" variant="default" />
}

const getCurrencySymbol = (discount) => {
  if (discount.rule.type === "fixed") {
    if (!discount.regions?.length) {
      return ""
    }
    return (
      <div className="text-grey-50">
        {discount.regions[0].currency_code.toUpperCase()}
      </div>
    )
  }
  return ""
}

const getDiscountAmount = (discount) => {
  switch (discount.rule.type) {
    case "fixed":
      if (!discount.regions?.length) {
        return ""
      }
      return formatAmountWithSymbol({
        currency: discount.regions[0].currency_code,
        amount: discount.rule.value,
      })
    case "percentage":
      return `${discount.rule.value}%`
    case "free_shipping":
      return "Free Shipping"
    default:
      return ""
  }
}

export const useDiscountTableColumns = () => {
  const columns = useMemo(
    () => [
      {
        Header: <Table.HeadCell className="pl-2">Code</Table.HeadCell>,
        accessor: "code",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index}>
            <Badge variant="default">
              <span className="inter-small-regular">{value}</span>
            </Badge>
          </Table.Cell>
        ),
      },
      {
        Header: "Description",
        accessor: "rule.description",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index}>{value}</Table.Cell>
        ),
      },
      {
        Header: <div className="text-right">Amount</div>,
        id: "amount",
        Cell: ({ row: { original }, index }) => {
          return (
            <Table.Cell className="text-right" key={index}>
              {getDiscountAmount(original)}
            </Table.Cell>
          )
        },
      },
      {
        Header: <div className="w-[60px]" />,
        id: "currency",
        Cell: ({ row: { original }, index }) => (
          <Table.Cell className="px-2 text-grey-40" key={index}>
            {getCurrencySymbol(original)}
          </Table.Cell>
        ),
      },
      {
        Header: "Status",
        accessor: "ends_at",
        Cell: ({ row: { original }, index }) => (
          <Table.Cell key={index}>{getDiscountStatus(original)}</Table.Cell>
        ),
      },
      {
        Header: () => <div className="text-right">Usage count</div>,
        accessor: "usage_count",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell className="text-right" key={index}>
            {value}
          </Table.Cell>
        ),
      },
    ],
    []
  )

  return [columns]
}
