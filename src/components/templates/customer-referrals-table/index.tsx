import React from "react"
import { CustomerReferralRedemption } from "@medusajs/medusa"
import { RouteComponentProps } from "@reach/router"
import moment from "moment"
import { stringDisplayPrice } from "../../../utils/prices"
import StatusDot from "../../fundamentals/status-indicator"
import Table from "../../molecules/table"

type CustomerReferralsTableProps = {
  referrals: CustomerReferralRedemption[]
} & RouteComponentProps

const CustomerReferralsTable: React.FC<CustomerReferralsTableProps> = ({
  referrals,
}) => {
  const decideStatus = (rewarded) => {
    if (!rewarded) {
      return <StatusDot variant="warning" title={"Pending"} />
    }
    return <StatusDot variant="success" title={"Rewarded"} />
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <Table>
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Referred Customer ID</Table.HeadCell>
            <Table.HeadCell>Discount</Table.HeadCell>
            <Table.HeadCell>Gift Card</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body>
          {referrals?.map(
            (
              {
                referred_customer_id,
                referred_customer,
                created_at,
                rewarded,
                gift_card,
                discount,
              },
              index
            ) => {
              return (
                <Table.Row key={`invite-${index}`} className="py-2">
                  <Table.Cell className="text-grey-90 w-24">
                    {moment(created_at).format("DD MMM YYYY hh:mm")}
                  </Table.Cell>
                  <Table.Cell
                    className="cursor-pointer hover:bg-gray-100"
                    linkTo={`/a/customers/${referred_customer_id}`}
                  >
                    {referred_customer.first_name} {referred_customer.last_name}
                  </Table.Cell>
                  {/* TODO: figure out how we want to display discount and possibly link to discount given */}
                  <Table.Cell
                    className="cursor-pointer hover:bg-gray-100"
                    linkTo={
                      discount?.id ? `/a/discounts/${discount?.id}` : undefined
                    }
                  >
                    {discount?.code}
                  </Table.Cell>
                  <Table.Cell
                    className="cursor-pointer hover:bg-gray-100"
                    linkTo={
                      gift_card ? `/a/gift-cards/${gift_card.id}` : undefined
                    }
                  >
                    {stringDisplayPrice({
                      amount: gift_card?.value,
                      currencyCode: "USD",
                    })}
                  </Table.Cell>
                  <Table.Cell>{decideStatus(rewarded)}</Table.Cell>
                  <Table.Cell />
                </Table.Row>
              )
            }
          )}
        </Table.Body>
      </Table>
    </div>
  )
}

export default CustomerReferralsTable
