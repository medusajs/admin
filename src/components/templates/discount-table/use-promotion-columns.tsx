import { end, parse } from "iso8601-duration"
import React, { useMemo } from "react"
import { formatAmountWithSymbol } from "../../../utils/prices"
import Badge from "../../fundamentals/badge"
import StatusDot from "../../fundamentals/status-indicator"
import Table from "../../molecules/table"

enum PromotionStatus {
  SCHEDULED = "SCHEDULED",
  EXPIRED = "EXPIRED",
  ACTIVE = "ACTIVE",
  DISABLED = "DISABLED",
}

const getPromotionStatus = (promotion) => {
  if (!promotion.is_disabled) {
    const date = new Date()
    if (new Date(promotion.starts_at) > date) {
      return PromotionStatus.SCHEDULED
    } else if (
      (promotion.ends_at && new Date(promotion.ends_at) < date) ||
      (promotion.valid_duration &&
        date >
          end(
            parse(promotion.valid_duration),
            new Date(promotion.starts_at)
          )) ||
      promotion.usage_count === promotion.usage_limit
    ) {
      return PromotionStatus.EXPIRED
    } else {
      return PromotionStatus.ACTIVE
    }
  }
  return PromotionStatus.DISABLED
}

const getPromotionStatusDot = (promotion) => {
  const status = getPromotionStatus(promotion)
  switch (status) {
    case PromotionStatus.SCHEDULED:
      return <StatusDot title="Scheduled" variant="warning" />
    case PromotionStatus.EXPIRED:
      return <StatusDot title="Expired" variant="danger" />
    case PromotionStatus.ACTIVE:
      return <StatusDot title="Active" variant="success" />
    case PromotionStatus.DISABLED:
      return <StatusDot title="Disabled" variant="default" />
    default:
      return <StatusDot title="Disabled" variant="default" />
  }
}

const getCurrencySymbol = (promotion) => {
  if (promotion.rule.type === "fixed") {
    if (!promotion.regions?.length) {
      return ""
    }
    return promotion.regions[0].currency_code.toUpperCase()
  }
  return ""
}

const getPromotionAmount = (promotion) => {
  switch (promotion.rule.type) {
    case "fixed":
      if (!promotion.regions?.length) {
        return ""
      }
      return formatAmountWithSymbol({
        currency: promotion.regions[0].currency_code,
        amount: promotion.rule.value,
      })
    case "percentage":
      return `${promotion.rule.value}%`
    case "free_shipping":
      return "Free Shipping"
    default:
      return ""
  }
}

export const usePromotionTableColumns = () => {
  const columns = useMemo(
    () => [
      {
        Header: <Table.HeadCell className="pl-2">Code</Table.HeadCell>,
        accessor: "code",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index}>
            <div className="overflow-hidden">
              <Badge className="rounded-rounded" variant="default">
                <span className="inter-small-regular">{value}</span>
              </Badge>
            </div>
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
              {getPromotionAmount(original)}
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
          <Table.Cell key={index}>{getPromotionStatusDot(original)}</Table.Cell>
        ),
      },
      {
        Header: () => <div className="text-right">Redemptions</div>,
        accessor: "usage_count",
        Cell: ({ row: { original }, index }) => {
          return (
            <Table.Cell className="text-right" key={index}>
              {original.usage_limit > 0
                ? getUsageCount(original.usage_count)
                : "-"}
            </Table.Cell>
          )
        },
      },
    ],
    []
  )

  return [columns]
}

const getUsageCount = (usageCount: number) => {
  switch (true) {
    case usageCount > 9999999:
      return `${Math.floor(usageCount / 1000000)}m`
    case usageCount > 9999:
      return `${Math.floor(usageCount / 1000)}k`
    default:
      return usageCount
  }
}
