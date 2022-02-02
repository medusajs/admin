import moment from "moment"
import React, { useMemo } from "react"
import ReactCountryFlag from "react-country-flag"
import { getColor } from "../../../utils/color"
import { formatAmountWithSymbol } from "../../../utils/prices"
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
        Header: "Order",
        accessor: "display_id",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index}>{`#${value}`}</Table.Cell>
        ),
      },
      {
        Header: "Date added",
        accessor: "created_at",
        Cell: ({ cell: { value }, index }) => (
          <Table.Cell key={index}>
            {moment(value).format("DD MMM YYYY")}
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
          <Table.Cell className="w-[5%]" key={index}>
            <div className="flex w-full justify-end">
              <ReactCountryFlag
                svg
                countryCode={row.original.shipping_address.country_code}
              />
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
