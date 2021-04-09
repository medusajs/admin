import React, { useState, useRef, useEffect } from "react"
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
import Badge from "../../../components/badge"

import { decideBadgeColor } from "../../../utils/decide-badge-color"
import useMedusa from "../../../hooks/use-medusa"
import Spinner from "../../../components/spinner"
import Button from "../../../components/button"

const OrderNumCell = styled(Text)`
  z-index: 1000;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    color: #454b54;
  }

  ${props => props.isCanceled && "text-decoration: line-through;"}
`

const ReturnIndex = ({}) => {
  const filtersOnLoad = queryString.parse(window.location.search)

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 20
  }

  const { returns, isLoading, refresh, isReloading } = useMedusa("returns", {
    search: filtersOnLoad,
  })

  const searchRef = useRef(null)
  const [query, setQuery] = useState(null)
  const [limit, setLimit] = useState(filtersOnLoad.limit || 20)
  const [offset, setOffset] = useState(filtersOnLoad.offset || 0)
  const [fetching, setFetching] = useState(false)

  const onKeyDown = event => {
    switch (event.key) {
      case "Enter":
        event.preventDefault()
        event.stopPropagation()
        searchQuery()
        break
      case "Esc":
      case "Escape":
        searchRef.current.blur()
        break
      default:
        break
    }
  }

  const searchQuery = () => {
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
          Returns
        </Text>
      </Flex>
      <Flex>
        <Box mb={3} sx={{ maxWidth: "300px" }} mr={2}>
          <Input
            ref={searchRef}
            height="30px"
            fontSize="12px"
            id="email"
            name="q"
            type="text"
            placeholder="Search returns"
            onKeyDown={onKeyDown}
            onChange={e => setQuery(e.target.value)}
            value={query}
          />
        </Box>
        <Button
          onClick={() => searchQuery()}
          variant={"primary"}
          fontSize="12px"
          mr={2}
        >
          Search
        </Button>
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
      ) : !returns.length ? (
        <Flex alignItems="center" justifyContent="center" mt="10%">
          <Text height="75px" fontSize="16px">
            No returns found
          </Text>
        </Flex>
      ) : (
        <Table>
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>Order</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Refund amount</TableHeaderCell>
              <TableHeaderCell sx={{ maxWidth: "75px" }} />
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {returns.map((el, i) => {
              const goto = el.swap ? el.swap.order_id : el.order_id
              return (
                <TableLinkRow
                  key={i}
                  to={`/a/orders/${goto}`}
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
                      {el.swap ? "Swap" : "Return"}
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
                        color={decideBadgeColor(el.status).color}
                        bg={decideBadgeColor(el.status).bgColor}
                      >
                        {el.status}
                      </Badge>
                    </BadgdeCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    <DefaultCellContent>
                      {(el.refund_amount / 100).toFixed(2)}
                    </DefaultCellContent>
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

const Returns = () => {
  return (
    <Router>
      <ReturnIndex path="/" />
    </Router>
  )
}

export default Returns
