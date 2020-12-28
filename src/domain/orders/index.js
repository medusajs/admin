import React, { useState, useRef, useEffect } from "react"
import { navigate } from "gatsby"
import _ from "lodash"
import { Router } from "@reach/router"
import { Text, Box, Flex } from "rebass"
import { Input } from "@rebass/forms"
import styled from "@emotion/styled"
import moment from "moment"
import qs from "query-string"
import ReactCountryFlag from "react-country-flag"
import ReactTooltip from "react-tooltip"
import { useHotkeys } from "react-hotkeys-hook"

import Details from "./details"
import New from "./new"
import {
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableDataCell,
  TableHeaderRow,
} from "../../components/table"
import Badge from "../../components/badge"

import { decideBadgeColor } from "../../utils/decide-badge-color"
import useMedusa from "../../hooks/use-medusa"
import Spinner from "../../components/spinner"
import Button from "../../components/button"
import Filter from "./filter-dropdown"

const TabButton = styled.button`
  border-radius: 0pt;
  border: none;
  width: 120px;
  height: 30px;
  font-size: 12px;
  background-color: #fefefe;

  ${props =>
    props.active &&
    `
    border-bottom: 1px solid black;
    font-weight: bold;
  `}

  p {
    cursor: pointer;
    display: inline-block;
    margin: 0px;
  }

  outline: none;
`

const OrderNumCell = styled(Text)`
  color: #006fbb;
  z-index: 1000;

  ${props => props.isCanceled && "text-decoration: line-through;"}

  &:hover {
    text-decoration: underline;
  }
`

const Tabs = [
  { label: "New", value: "new" },
  { label: "Returns", value: "returns" },
  { label: "Swaps", value: "swaps" },
  { label: "Requires action", value: "requires_action" },
  { label: "All", value: "all" },
]

const OrderIndex = ({}) => {
  const filtersOnLoad = qs.parse(window.location.search)

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 50
  }

  const {
    orders,
    total_count,
    hasCache,
    isLoading,
    refresh,
    isReloading,
    toaster,
  } = useMedusa("orders", {
    search: {
      ...filtersOnLoad,
      fields:
        "_id,display_id,created,email,fulfillment_status,payment_status,payment_method,total,shipping_address",
    },
  })

  const handleCopyToClip = val => {
    var tempInput = document.createElement("input")
    tempInput.value = val
    document.body.appendChild(tempInput)
    tempInput.select()
    document.execCommand("copy")
    document.body.removeChild(tempInput)
    toaster("Copied!", "success")
  }

  const [activeTab, setActiveTab] = useState(
    window.location.search && qs.parse(window.location.search).status
      ? qs.parse(window.location.search).status
      : "all"
  )

  const searchRef = useRef(null)
  const [query, setQuery] = useState("")
  const [limit, setLimit] = useState(50)
  const [offset, setOffset] = useState(0)
  const [statusFilter, setStatusFilter] = useState({ open: false, filter: "" })
  const [fulfillmentFilter, setFulfillmentFilter] = useState({
    open: false,
    filter: "",
  })
  const [paymentFilter, setPaymentFilter] = useState({
    open: false,
    filter: "",
  })

  const isInViewport = el => {
    const rect = el.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  const [activeIndex, setActiveIndex] = useState(-1)
  useHotkeys(
    "/",
    () => {
      if (searchRef && searchRef.current) {
        searchRef.current.focus()
      }
    },
    {},
    [searchRef]
  )
  useHotkeys("j", () => setActiveIndex(i => Math.min(i + 1, 50)))
  useHotkeys("k", () => setActiveIndex(i => Math.max(i - 1, 0)))
  useHotkeys(
    "command+i",
    () => {
      if (activeIndex === -1) return
      const o = orders[activeIndex]
      handleCopyToClip(o.display_id)
    },
    {},
    [activeIndex]
  )
  useHotkeys(
    "enter",
    () => {
      if (activeIndex === -1) return
      const o = orders[activeIndex]
      navigate(`/a/orders/${o._id}`)
    },
    {},
    [activeIndex]
  )

  useEffect(() => {
    if (activeIndex === -1) {
      return
    }
    const o = orders[activeIndex]
    const el = document.querySelector(`#order-${o._id}`)
    if (!isInViewport(el)) {
      el.scrollIntoView({
        behavior: "smooth",
      })
    }
  }, [activeIndex])

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
    const baseUrl = qs.parseUrl(window.location.href).url

    const queryParts = {
      q: query,
      payment_status: paymentFilter.filter || "",
      fulfillment_status: fulfillmentFilter.filter || "",
      status: statusFilter.filter || "",
      offset,
      limit,
    }
    const prepared = qs.stringify(queryParts, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.replaceState(baseUrl, "", `?${prepared}`)
    refresh({
      search: {
        ...queryParts,
        fields:
          "_id,display_id,created,email,fulfillment_status,payment_status,payment_method,total,shipping_address",
      },
    })
  }

  const handlePagination = direction => {
    const updatedOffset = direction === "next" ? offset + limit : offset - limit
    const baseUrl = qs.parseUrl(window.location.href).url

    const queryParts = {
      q: query,
      payment_status: paymentFilter.filter || "",
      fulfillment_status: fulfillmentFilter.filter || "",
      status: statusFilter.filter
        ? statusFilter.filter
        : activeTab !== "all"
        ? activeTab
        : "",
      offset: updatedOffset,
      limit,
    }

    const prepared = qs.stringify(queryParts, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.replaceState(baseUrl, "", `?${prepared}`)

    refresh({
      search: {
        ...queryParts,
        fields:
          "_id,display_id,created,email,fulfillment_status,payment_status,payment_method,total,shipping_address",
      },
    }).then(() => {
      setOffset(updatedOffset)
    })
  }

  const submit = () => {
    const baseUrl = qs.parseUrl(window.location.href).url

    const queryParts = {
      q: query,
      payment_status: paymentFilter.filter || "",
      fulfillment_status: fulfillmentFilter.filter || "",
      status: statusFilter.filter
        ? statusFilter.filter
        : activeTab
        ? activeTab
        : "",
      offset,
      limit,
    }

    const prepared = qs.stringify(queryParts, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.replaceState(baseUrl, "", `?${prepared}`)
    refresh({
      search: {
        ...queryParts,
        fields:
          "_id,display_id,created,email,fulfillment_status,payment_status,payment_method,total,shipping_address",
      },
    })
  }

  const handleTabClick = tab => {
    if (activeTab === tab) return
    setActiveTab(tab)
    const baseUrl = qs.parseUrl(window.location.href).url

    const queryParts = {
      q: query,
      status: tab !== "all" ? tab : "",
      offset: 0,
      limit,
    }

    const prepared = qs.stringify(queryParts, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.replaceState(baseUrl, "", `?${prepared}`)
    refresh({
      search: {
        ...queryParts,
        fields:
          "_id,display_id,created,email,fulfillment_status,payment_status,payment_method,total,shipping_address",
      },
    })
  }

  const clear = () => {
    const baseUrl = qs.parseUrl(window.location.href).url
    setQuery("")
    window.history.replaceState(baseUrl, "", `?limit=${limit}&offset=${offset}`)
    refresh()
  }

  const moreResults = orders && orders.length >= limit

  return (
    <Flex flexDirection="column" pb={5} pt={5}>
      <Flex>
        <Text mb={3} fontSize={20} fontWeight="bold">
          Orders
        </Text>
        <Box ml="auto" />
        <Button
          disabled={true}
          onClick={() => navigate(`/a/orders/new`)}
          variant={"cta"}
        >
          New draft order
        </Button>
      </Flex>
      <Flex>
        <Box ml="auto" />
        <Box mb={3} sx={{ maxWidth: "300px" }} mr={2}>
          <Input
            ref={searchRef}
            height="28px"
            fontSize="12px"
            id="email"
            name="q"
            type="text"
            placeholder="Search orders"
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
        <Filter
          submitFilters={submit}
          clearFilters={clear}
          statusFilter={statusFilter}
          fulfillmentFilter={fulfillmentFilter}
          paymentFilter={paymentFilter}
          setStatusFilter={setStatusFilter}
          setPaymentFilter={setPaymentFilter}
          setFulfillmentFilter={setFulfillmentFilter}
        />
      </Flex>
      <Flex mb={3} sx={{ borderBottom: "1px solid hsla(0, 0%, 0%, 0.12)" }}>
        {Tabs.map(tab => (
          <TabButton
            active={tab.value === activeTab}
            onClick={() => handleTabClick(tab.value)}
          >
            <p>{tab.label}</p>
          </TabButton>
        ))}
      </Flex>
      {(isLoading && !hasCache) || isReloading ? (
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
      ) : !orders.length ? (
        <Flex alignItems="center" justifyContent="center" mt="10%">
          <Text height="75px" fontSize="16px">
            No orders found
          </Text>
        </Flex>
      ) : (
        <Table>
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>Order</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Customer</TableHeaderCell>
              <TableHeaderCell>Fulfillment</TableHeaderCell>
              <TableHeaderCell>Payment</TableHeaderCell>
              <TableHeaderCell>Total</TableHeaderCell>
              <TableHeaderCell sx={{ maxWidth: "75px" }} />
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {orders.map((el, i) => {
              return (
                <TableRow
                  key={i}
                  id={`order-${el._id}`}
                  isHighlighted={i === activeIndex}
                  onClick={() => navigate(`/a/orders/${el._id}`)}
                >
                  <TableDataCell>
                    <OrderNumCell isCanceled={el.status === "canceled"}>
                      #{el.display_id}
                    </OrderNumCell>
                  </TableDataCell>
                  <TableDataCell
                    data-for={el._id}
                    data-tip={moment(el.created).format("MMMM Do YYYY HH:mm a")}
                  >
                    <ReactTooltip id={el._id} place="top" effect="solid" />
                    {moment(el.created).format("MMM Do YYYY")}
                  </TableDataCell>
                  <TableDataCell>{el.email}</TableDataCell>
                  <TableDataCell>
                    <Box>
                      <Badge
                        color={decideBadgeColor(el.fulfillment_status).color}
                        bg={decideBadgeColor(el.fulfillment_status).bgColor}
                      >
                        {el.fulfillment_status}
                      </Badge>
                    </Box>
                  </TableDataCell>
                  <TableDataCell>
                    <Box>
                      <Badge
                        color={decideBadgeColor(el.payment_status).color}
                        bg={decideBadgeColor(el.payment_status).bgColor}
                      >
                        {el.payment_status}
                      </Badge>
                    </Box>
                  </TableDataCell>
                  <TableDataCell>
                    {parseInt(el.total).toFixed(2)} {el.currency_code}
                  </TableDataCell>
                  <TableDataCell maxWidth="75px">
                    {el.shipping_address.country_code ? (
                      <ReactCountryFlag
                        style={{ maxHeight: "100%", marginBottom: "0px" }}
                        svg
                        countryCode={el.shipping_address.country_code}
                      />
                    ) : (
                      ""
                    )}
                  </TableDataCell>
                </TableRow>
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
          disabled={!moreResults}
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

const Orders = () => {
  return (
    <Router>
      <OrderIndex path="/" />
      <Details path=":id" />
      <New path="/new" />
    </Router>
  )
}

export default Orders
