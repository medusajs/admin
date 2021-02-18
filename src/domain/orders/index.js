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
import Medusa from "../../services/api"

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
  TableLinkRow,
} from "../../components/table"
import Badge from "../../components/badge"

import { decideBadgeColor } from "../../utils/decide-badge-color"
import useMedusa from "../../hooks/use-medusa"
import Spinner from "../../components/spinner"
import Button from "../../components/button"
import Filter from "./filter-dropdown"
import NewOrder from "./new/new-order"
import DraftOrders from "./draft-orders"
import DraftOrderDetails from "./draft-orders/details"

const TabButton = styled.button`
  border-radius: 0pt;
  border: none;
  height: 30px;
  font-size: 14px;
  background-color: #fefefe;
  text-align: left;
  margin-right: 15px;

  ${props =>
    props.active &&
    `
    border-bottom: 1px solid black;
    // font-weight: bold;
  `}

  p {
    cursor: pointer;
    display: inline-block;
    margin: 0px;
  }

  outline: none;
`

export const OrderNumCell = styled(Text)`
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
  { label: "All", value: "orders" },
  { label: "Draft", value: "draft-orders" },
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
    orders: allOrders,
    hasCache,
    isLoading,
    refresh,
    isReloading,
    toaster,
  } = useMedusa("orders", {
    search: {
      ...filtersOnLoad,
      expand: "shipping_address",
      fields:
        "id,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code",
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

  const searchRef = useRef(null)

  const [query, setQuery] = useState("")
  const [limit, setLimit] = useState(filtersOnLoad.limit || 0)
  const [offset, setOffset] = useState(filtersOnLoad.offset || 0)
  const [orders, setOrders] = useState([])
  const [draftOrders, setDraftOrders] = useState([])
  const [activeTab, setActiveTab] = useState(
    filtersOnLoad.tab ? filtersOnLoad.tab : "orders"
  )
  const [fetching, setFetching] = useState(false)

  const [showNewOrder, setShowNewOrder] = useState(false)

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
      navigate(`/a/orders/${o.id}`)
    },
    {},
    [activeIndex]
  )

  useEffect(() => {
    if (activeTab) {
      handleTabClick(activeTab, query)
    }
  }, [activeTab])

  useEffect(() => {
    if (activeIndex === -1) {
      return
    }
    const o = orders[activeIndex]
    const el = document.querySelector(`#order-${o.id}`)
    if (!isInViewport(el)) {
      el.scrollIntoView({
        behavior: "smooth",
      })
    }
  }, [activeIndex])

  useEffect(() => {
    if (allOrders) {
      setOrders(allOrders)
    }
  }, [allOrders])

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
      offset: 0,
      limit: 50,
    }
    const prepared = qs.stringify(queryParts, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.replaceState(baseUrl, "", `?${prepared}`)
    refresh({
      search: {
        ...queryParts,
        expand: "shipping_address",
        fields:
          "id,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code",
      },
    })
  }

  const handlePagination = direction => {
    const updatedOffset =
      direction === "next"
        ? parseInt(offset) + parseInt(limit)
        : parseInt(offset) - parseInt(limit)
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

    handleTabClick(activeTab, queryParts).then(() => {
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
    handleTabClick(activeTab, queryParts)
  }

  const handleTabClick = async (tab, query) => {
    const baseUrl = qs.parseUrl(window.location.href).url
    setFetching(true)
    setActiveTab(tab)
    switch (tab) {
      case "swaps":
        setDraftOrders([])
        const swaps = await Medusa.swaps.list(query)
        setOrders(swaps.data.swaps)
        setFetching(false)
        break
      case "returns":
        setDraftOrders([])
        const returns = await Medusa.returns.list(query)
        setOrders(returns.data.returns)
        setFetching(false)
        break
      case "new":
        setDraftOrders([])
        refresh({
          search: {
            ...query,
            new: true,
            expand: "shipping_address",
            fields:
              "id,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code",
          },
        })
        setOrders(allOrders)
        setFetching(false)
        break
      case "orders":
        setDraftOrders([])
        refresh({
          search: {
            ...query,
            expand: "shipping_address",
            fields:
              "id,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code",
          },
        })
        setOrders(allOrders)
        setFetching(false)
        break
      case "draft-orders":
        const draftOrders = await Medusa.draftOrders.list(query)
        setDraftOrders(draftOrders.data.draft_orders)
        setFetching(false)
        break
      default:
        setFetching(false)
        break
    }

    window.history.replaceState(baseUrl, "", `?tab=${tab}`)
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
        <Button onClick={() => setShowNewOrder(true)} variant={"cta"}>
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
          disabled={activeTab !== "orders" && activeTab !== "new"}
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
        {Tabs.map((tab, i) => (
          <TabButton
            key={i}
            active={tab.value === activeTab}
            onClick={() => handleTabClick(tab.value)}
          >
            <p>{tab.label}</p>
          </TabButton>
        ))}
      </Flex>
      {(isLoading && !hasCache) || isReloading || fetching ? (
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
      ) : !orders.length && !draftOrders.length ? (
        <Flex alignItems="center" justifyContent="center" mt="10%">
          <Text height="75px" fontSize="16px">
            No orders found
          </Text>
        </Flex>
      ) : draftOrders.length ? (
        <DraftOrders draftOrders={draftOrders} />
      ) : (
        <Table>
          <TableHead>
            <TableHeaderRow>
              <TableHeaderCell>Order</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              {(activeTab === "orders" || activeTab === "new") && (
                <TableHeaderCell>Customer</TableHeaderCell>
              )}
              <TableHeaderCell>
                {activeTab === "returns" ? "Status" : "Fulfillment"}
              </TableHeaderCell>
              {activeTab !== "returns" && (
                <TableHeaderCell>Payment</TableHeaderCell>
              )}
              <TableHeaderCell>
                {activeTab === "orders" || activeTab === "new"
                  ? "Total"
                  : activeTab === "swaps"
                  ? "Difference due"
                  : "Refund amount"}
              </TableHeaderCell>
              <TableHeaderCell sx={{ maxWidth: "75px" }} />
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {orders.map((el, i) => {
              const goToId =
                activeTab === "swaps"
                  ? el.order_id
                  : activeTab === "returns" && el.swap
                  ? el.swap.order_id
                  : activeTab === "returns"
                  ? el.order_id
                  : el.id

              return (
                <TableLinkRow
                  key={i}
                  to={`/a/orders/${goToId}`}
                  id={`order-${el.id}`}
                  isHighlighted={i === activeIndex}
                >
                  <TableDataCell>
                    <OrderNumCell isCanceled={el.status === "canceled"}>
                      {activeTab === "orders" || activeTab === "new"
                        ? `#${el.display_id}`
                        : `Go to order`}
                    </OrderNumCell>
                  </TableDataCell>
                  <TableDataCell
                    data-for={el.id}
                    data-tip={moment(el.created_at).format(
                      "MMMM Do YYYY HH:mm a"
                    )}
                  >
                    <ReactTooltip id={el.id} place="top" effect="solid" />
                    {moment(el.created_at).format("MMM Do YYYY")}
                  </TableDataCell>
                  {(activeTab === "orders" || activeTab === "new") && (
                    <TableDataCell>{el.email}</TableDataCell>
                  )}
                  <TableDataCell>
                    <Box>
                      <Badge
                        color={
                          decideBadgeColor(
                            activeTab === "returns"
                              ? el.status
                              : el.fulfillment_status
                          ).color
                        }
                        bg={
                          decideBadgeColor(
                            activeTab === "returns"
                              ? el.status
                              : el.fulfillment_status
                          ).bgColor
                        }
                      >
                        {activeTab === "returns"
                          ? el.status
                          : el.fulfillment_status}
                      </Badge>
                    </Box>
                  </TableDataCell>
                  {activeTab !== "returns" && (
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
                  )}
                  <TableDataCell>
                    {activeTab === "orders" || activeTab === "new" ? (
                      <>
                        {(el.total / 100).toFixed(2)}{" "}
                        {el.currency_code.toUpperCase()}
                      </>
                    ) : activeTab === "swaps" ? (
                      <>{(el.difference_due / 100).toFixed(2)} </>
                    ) : (
                      <>{(el.refund_amount / 100).toFixed(2)} </>
                    )}
                  </TableDataCell>
                  <TableDataCell maxWidth="75px">
                    {el.shipping_address?.country_code ? (
                      <ReactCountryFlag
                        style={{ maxHeight: "100%", marginBottom: "0px" }}
                        svg
                        countryCode={el.shipping_address.country_code}
                      />
                    ) : (
                      ""
                    )}
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
          disabled={!moreResults}
          variant={"primary"}
          fontSize="12px"
          height="24px"
          ml={1}
        >
          Next
        </Button>
      </Flex>
      {showNewOrder && (
        <NewOrder
          onDismiss={() => setShowNewOrder(false)}
          refresh={() => handleTabClick("draft-orders", query)}
        />
      )}
    </Flex>
  )
}

const Orders = () => {
  return (
    <Router>
      <OrderIndex path="/" />
      <Details path=":id" />
      <DraftOrderDetails path="/draft/:id" />
      <New path="/new" />
    </Router>
  )
}

export default Orders
