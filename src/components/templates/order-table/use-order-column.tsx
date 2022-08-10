import moment from "moment"
import React, { useMemo } from "react"
import ReactCountryFlag from "react-country-flag"
import { getColor } from "../../../utils/color"
import { isoAlpha2Countries } from "../../../utils/countries"
import { formatAmountWithSymbol } from "../../../utils/prices"
import Tooltip from "../../atoms/tooltip"
import StatusDot from "../../fundamentals/status-indicator"
import CustomerAvatarItem from "../../molecules/customer-avatar-item"
import Table from "../../molecules/table"

const useOrderTableColums = () => {
  const decideStatus = (status) => {
    switch (status) {
      case "captured":
        return <StatusDot variant="success" title={"Paid"} />
      case "awaiting":
        return <StatusDot variant="default" title={"Awaiting"} />
      case "requires_action":
        return <StatusDot variant="danger" title={"Requires action"} />
      case "canceled":
        return <StatusDot variant="warning" title={"Canceled"} />
      default:
        return <StatusDot variant="primary" title={"N/A"} />
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: <Table.HeadCell className="pl-2">Order</Table.HeadCell>,
        accessor: "display_id",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell
            key={index}
            className="text-grey-90 group-hover:text-violet-60 min-w-[100px] pl-2"
          >{`#${value}`}</Table.Cell>
        ),
      },
      {
        Header: "Date added",
        accessor: "created_at",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index}>
            <Tooltip content={moment(value).format("DD MMM YYYY hh:mm a")}>
              {moment(value).format("DD MMM YYYY")}
            </Tooltip>
          </Table.Cell>
        ),
      },
      {
        Header: "Customer",
        accessor: "shipping_address",
        Cell: ({ row, cell: { value }, index }) => (
          <Table.Cell key={index}>
            <CustomerAvatarItem
              customer={{
                first_name: value.first_name,
                last_name: value.last_name,
              }}
              color={getColor(row.index)}
            />
          </Table.Cell>
        ),
      },
      {
        Header: "Fulfillment",
        accessor: "fulfillment_status",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index}>{value}</Table.Cell>
        ),
      },
      {
        Header: "Payment status",
        accessor: "payment_status",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index}>{decideStatus(value)}</Table.Cell>
        ),
      },
      {
        Header: "Sales Channel",
        accessor: "sales_channel",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index}>{value?.name ?? "N/A"}</Table.Cell>
        ),
      },
      {
        Header: () => <div className="text-right">Total</div>,
        accessor: "total",
        Cell: ({ row, cell: { value }, index }) => (
          <Table.Cell key={index}>
            <div className="text-right">
              {formatAmountWithSymbol({
                amount: value,
                currency: row.original.currency_code,
                digits: 2,
              })}
            </div>
          </Table.Cell>
        ),
      },
      {
        Header: "",
        accessor: "currency_code",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index} className="w-[5%]">
            <div className="text-right text-grey-40">{value.toUpperCase()}</div>
          </Table.Cell>
        ),
      },
      {
        Header: "",
        accessor: "country_code",
        Cell: ({ row, index }) => (
          <Table.Cell className="w-[5%] pr-2" key={index}>
            <div className="flex rounded-rounded w-full justify-end">
              <Tooltip
                content={
                  isoAlpha2Countries[
                    row.original.shipping_address.country_code.toUpperCase()
                  ] || row.original.shipping_address.country_code.toUpperCase()
                }
              >
                <ReactCountryFlag
                  className={"rounded"}
                  svg
                  countryCode={row.original.shipping_address.country_code}
                />
              </Tooltip>
            </div>
          </Table.Cell>
        ),
      },
    ],
    []
  )

  return [columns]
}

export default useOrderTableColums
