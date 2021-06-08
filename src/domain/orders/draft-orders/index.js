import React, { useState } from "react"
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
  DefaultCellContent,
  BadgdeCellContent,
} from "../../../components/table"
import ReactTooltip from "react-tooltip"
import { Box, Flex, Text } from "rebass"
import Badge from "../../../components/badge"
import { decideBadgeColor } from "../../../utils/decide-badge-color"
import Spinner from "../../../components/spinner"
import useMedusa from "../../../hooks/use-medusa"
import DraftOrderDetails from "./details"
import { Router } from "@reach/router"
import NewOrder from "../new/new-order"
import Button from "../../../components/button"

const DraftOrderIndex = ({}) => {
  const [showNewOrder, setShowNewOrder] = useState(false)

  const {
    draft_orders: draftOrders,
    refresh,
    isLoading,
    isReloading,
  } = useMedusa("draftOrders", {
    search: {
      limit: 20,
      offset: 0,
    },
  })

  return (
    <Flex flexDirection="column" pb={5} pt={5}>
      <Flex>
        <Text mb={3} fontSize={20} fontWeight="bold">
          Draft orders
        </Text>
      </Flex>
      <Flex>
        <Box ml="auto" />
        <Button ml={2} onClick={() => setShowNewOrder(true)} variant={"cta"}>
          New draft order
        </Button>
      </Flex>
      {isLoading || isReloading ? (
        <Flex
          flexDirection="column"
          alignItems="center"
          height="100vh"
          mt="20%"
        >
          <Box height="50px" width="50px">
            <Spinner dark />
          </Box>
        </Flex>
      ) : !draftOrders.length ? (
        <Flex alignItems="center" justifyContent="center" mt="10%">
          <Text height="75px" fontSize="16px">
            No draft orders found
          </Text>
        </Flex>
      ) : (
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
                  to={`/a/draft-orders/${el.id}`}
                  id={`draft-order-${el.id}`}
                >
                  <TableDataCell>
                    <OrderNumCell
                      fontWeight={500}
                      color={"link"}
                    >{`#${el.display_id}`}</OrderNumCell>
                  </TableDataCell>
                  <TableDataCell>
                    <DefaultCellContent>
                      {el.order_id ? `#${el.order.display_id}` : "-"}
                    </DefaultCellContent>
                  </TableDataCell>
                  <TableDataCell
                    data-for={el.id}
                    data-tip={moment(el.created_at).format(
                      "MMMM Do YYYY HH:mm a"
                    )}
                  >
                    <ReactTooltip id={el.id} place="top" effect="solid" />
                    <DefaultCellContent>
                      {moment(el.created_at).format("MMM Do YYYY")}
                    </DefaultCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    <DefaultCellContent>{el.cart.email}</DefaultCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    <BadgdeCellContent>
                      <Badge
                        color={decideBadgeColor(el.status).color}
                        bg={decideBadgeColor(el.status).bgColor}
                      >
                        {el.status}
                      </Badge>
                    </BadgdeCellContent>
                  </TableDataCell>
                  <TableDataCell maxWidth="75px">-</TableDataCell>
                </TableLinkRow>
              )
            })}
          </TableBody>
        </Table>
      )}
      {showNewOrder && (
        <NewOrder
          onDismiss={() => setShowNewOrder(false)}
          refresh={() => refresh()}
        />
      )}
    </Flex>
  )
}

const DraftOrders = () => {
  return (
    <Router>
      <DraftOrderIndex path="/" />
      <DraftOrderDetails path=":id" />
    </Router>
  )
}

export default DraftOrders
