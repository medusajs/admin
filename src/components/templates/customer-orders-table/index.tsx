import { RouteComponentProps } from "@reach/router"
import { useAdminOrders } from "medusa-react"
import moment from "moment"
import React from "react"
import { stringDisplayPrice } from "../../../utils/prices"
import StatusDot from "../../fundamentals/status-dot"
import Table from "../../molecules/table"

type CustomerOrdersTableProps = {
  customerId: string
} & RouteComponentProps

const CustomerOrdersTable: React.FC<CustomerOrdersTableProps> = ({
  customerId,
}) => {
  const { orders, isLoading } = useAdminOrders({
    customer_id: customerId,
    offset: 0,
    limit: 14,
  })

  const decideStatus = (order) => {
    switch (order.payment_status) {
      case "captured":
        return <StatusDot variant="success" title={"Paid"} />
      case "awaiting":
        return <StatusDot variant="warning" title={"Awaiting"} />
      case "requires":
        return <StatusDot variant="danger" title={"Requires action"} />
      default:
        return <StatusDot variant="primary" title={"N/A"} />
    }
  }

  return (
    <div className="w-full h-full overflow-y-scroll">
      <Table>
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell className="w-[75px]">Order</Table.HeadCell>
            <Table.HeadCell />
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Fulfillment</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Total</Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body>
          {orders?.map((order, index) => (
            <Table.Row key={`invite-${index}`} linkTo={`/a/orders/${order.id}`}>
              <Table.Cell className="text-grey-40 w-20">
                #{order.display_id}
              </Table.Cell>
              <Table.Cell className="w-40">
                <div className="flex space-x-1">
                  {order?.items.slice(0, 2).map((item) => (
                    <div className="h-[40px] w-[30px]">
                      <img className="rounded" src={item.thumbnail} />
                    </div>
                  ))}
                </div>
              </Table.Cell>
              <Table.Cell className="">
                {moment(order.created_at).format("DD MMM YYYY hh:mm")}
              </Table.Cell>
              <Table.Cell className="">{order.fulfillment_status}</Table.Cell>
              <Table.Cell className="truncate">
                {decideStatus(order)}
              </Table.Cell>
              <Table.Cell className="">
                {stringDisplayPrice({
                  amount: order.total,
                  currencyCode: order.currency_code,
                })}
              </Table.Cell>
              <Table.Cell />
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}

export default CustomerOrdersTable
