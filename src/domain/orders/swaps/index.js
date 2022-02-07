import React, { useState, useRef, useEffect, useContext } from "react"
import _ from "lodash"
import { Router } from "@reach/router"
import { Text, Box, Flex } from "rebass"
import { Input } from "@rebass/forms"
import styled from "@emotion/styled"
import moment from "moment"
import qs from "qs"
import { default as queryString } from "query-string"
import ReactCountryFlag from "react-country-flag"
import ReactTooltip from "react-tooltip"
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
import Badge from "../../../components/fundamentals/badge"

import { decideBadgeColor } from "../../../utils/decide-badge-color"
import useMedusa from "../../../hooks/use-medusa"
import Spinner from "../../../components/spinner"
import Button from "../../../components/button"
import { InterfaceContext } from "../../../context/interface"

const OrderNumCell = styled(Text)`
  z-index: 1000;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    color: #454b54;
  }

  ${props => props.isCanceled && "text-decoration: line-through;"}
`

const SwapIndex = ({}) => {
  const filtersOnLoad = queryString.parse(window.location.search)

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 20
  }

  const { swaps, isLoading, refresh, isReloading } = useMedusa("swaps", {
    search: {
      ...filtersOnLoad,
      expand: "order",
    },
  })

  const searchRef = useRef(null)
  const [query, setQuery] = useState(null)
  const [limit, setLimit] = useState(filtersOnLoad.limit || 20)
  const [offset, setOffset] = useState(filtersOnLoad.offset || 0)
  const [fetching, setFetching] = useState(false)

  const searchQuery = query => {
    setOffset(0)
    const baseUrl = qs.parse(window.location.href).url

    const queryParts = {
      q: query,
      offset: 0,
      limit: 20,
    }
    const prepared = qs.stringify(queryParts, {
      skipNulls: true,
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

  const handlePagination = direction => {
    const updatedOffset =
      direction === "next"
        ? parseInt(offset) + parseInt(limit)
        : parseInt(offset) - parseInt(limit)
    const baseUrl = qs.parse(window.location.href).url

    const queryParts = {
      q: query,
      offset: updatedOffset,
      limit,
    }

    const prepared = qs.stringify(queryParts, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.replaceState(baseUrl, "", `?${prepared}`)

    refresh({ search: queryParts }).then(() => {
      setOffset(updatedOffset)
    })
  }

  return (
    <Flex flexDirection="column" pb={5} pt={5}>
      <Flex>
        <Text mb={3} fontSize={20} fontWeight="bold">
          Swaps
        </Text>
      </Flex>
      {isLoading || isReloading || fetching ? (
        <Flex
          flexDirection="column"
          alignItems="center"
          height="100vh"
          mt="auto"
        >
          <Box height="75px" width="75px" mt="50%">
            <Spinner dark />
          </Box>
        </Flex>
      ) : !swaps?.length ? (
        <Flex alignItems="center" justifyContent="center" mt="10%">
          <Text height="75px" fontSize="16px">
            No swaps found
          </Text>
        </Flex>
      ) : (
        <Table>
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>Order</TableHeaderCell>
              <TableHeaderCell>Difference due</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Payment</TableHeaderCell>
              <TableHeaderCell>Fulfillment</TableHeaderCell>
              <TableHeaderCell sx={{ maxWidth: "75px" }} />
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {swaps.map((el, i) => {
              return (
                <TableLinkRow
                  key={i}
                  to={`/a/orders/${el.order_id}`}
                  id={`order-${el.id}`}
                >
                  <TableDataCell>
                    <DefaultCellContent>
                      <OrderNumCell
                        fontWeight={500}
                        color={"link"}
                        isCanceled={el.status === "canceled"}
                      >
                        Go to order
                      </OrderNumCell>
                    </DefaultCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    <DefaultCellContent>
                      {(el.difference_due / 100).toFixed(2)}{" "}
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
                    <BadgdeCellContent>
                      <Badge
                        color={decideBadgeColor(el.payment_status).color}
                        bg={decideBadgeColor(el.payment_status).bgColor}
                      >
                        {el.payment_status}
                      </Badge>
                    </BadgdeCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    <BadgdeCellContent>
                      <Badge
                        color={decideBadgeColor(el.fulfillment_status).color}
                        bg={decideBadgeColor(el.fulfillment_status).bgColor}
                      >
                        {el.fulfillment_status}
                      </Badge>
                    </BadgdeCellContent>
                  </TableDataCell>
                  <TableDataCell maxWidth="75px">
                    <DefaultCellContent>
                      {el.shipping_address?.country_code ? (
                        <ReactCountryFlag
                          style={{ maxHeight: "100%", marginBottom: "0px" }}
                          svg
                          countryCode={el.shipping_address.country_code}
                        />
                      ) : (
                        "-"
                      )}
                    </DefaultCellContent>
                  </TableDataCell>
                </TableLinkRow>
              )
            })}
          </TableBody>
        </Table>
      )}
      <Flex mt={2}>
        <Box ml="auto" />
        <Button
          onClick={() => handlePagination("previous")}
          disabled={offset === 0}
          variant={"primary"}
          fontSize="12px"
          height="24px"
          mr={1}
        >
          Previous
        </Button>
        <Button
          onClick={() => handlePagination("next")}
          variant={"primary"}
          fontSize="12px"
          height="24px"
          ml={1}
        >
          Next
        </Button>
      </Flex>
    </Flex>
  )
}

const Swaps = () => {
  return (
    <Router>
      <SwapIndex path="/" />
    </Router>
  )
}

export default Swaps
