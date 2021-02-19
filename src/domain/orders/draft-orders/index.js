import React from "react"
import { OrderNumCell } from "../index"
import moment from "moment"
import {
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableDataCell,
  TableHeaderRow,
  TableLinkRow,
} from "../../../components/table"
import ReactTooltip from "react-tooltip"
import { Box } from "rebass"
import Badge from "../../../components/badge"
import { decideBadgeColor } from "../../../utils/decide-badge-color"

const DraftOrders = ({ draftOrders }) => {
  return (
    <Table>
      <TableHead>
        <TableHeaderRow>
          <TableHeaderCell>Draft</TableHeaderCell>
          <TableHeaderCell>Order</TableHeaderCell>
          <TableHeaderCell>Date</TableHeaderCell>
          <TableHeaderCell>Customer</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell sx={{ maxWidth: "75px" }} />
        </TableHeaderRow>
      </TableHead>
      <TableBody>
        {draftOrders.map((el, i) => {
          return (
            <TableLinkRow
              key={i}
              to={`/a/orders/draft/${el.id}`}
              id={`draft-order-${el.id}`}
            >
              <TableDataCell>
                <OrderNumCell>{`#${el.display_id}`}</OrderNumCell>
              </TableDataCell>
              <TableDataCell>
                {el.order_id ? `#${el.order.display_id}` : "-"}
              </TableDataCell>
              <TableDataCell
                data-for={el.id}
                data-tip={moment(el.created_at).format("MMMM Do YYYY HH:mm a")}
              >
                <ReactTooltip id={el.id} place="top" effect="solid" />
                {moment(el.created_at).format("MMM Do YYYY")}
              </TableDataCell>
              <TableDataCell>{el.cart.email}</TableDataCell>
              <TableDataCell>
                <Box>
                  <Badge
                    color={decideBadgeColor(el.status).color}
                    bg={decideBadgeColor(el.status).bgColor}
                  >
                    {el.status}
                  </Badge>
                </Box>
              </TableDataCell>
              <TableDataCell maxWidth="75px">-</TableDataCell>
            </TableLinkRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default DraftOrders
