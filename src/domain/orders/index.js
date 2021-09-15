import React, { useState, useRef, useEffect } from "react"
import { navigate } from "gatsby"
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
import { useHotkeys } from "react-hotkeys-hook"
import { ReactComponent as Cross } from "../../assets/svg/cross.svg"

import DraftOrders from "./draft-orders"
import DraftOrderDetails from "./draft-orders/details"
import NewOrder from "./new/new-order"

import Details from "./details"
import New from "./new"
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
} from "../../components/table"
import Badge from "../../components/badge"

import { displayAmount } from "../../utils/prices"
import { decideBadgeColor } from "../../utils/decide-badge-color"
import useMedusa from "../../hooks/use-medusa"
import Spinner from "../../components/spinner"
import Button from "../../components/button"
import Filter from "./filter-dropdown"
import { relativeDateFormatToTimestamp } from "../../utils/time"

const defaultQueryProps = {
  expand: "shipping_address",
  fields:
    "id,status,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code",
}

const removeNullish = obj =>
  Object.entries(obj).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {})

const TabButton = styled(Flex)`
  align-items: center;
  justify-content: center;
  border-radius: 0pt;
  border: none;
  height: 30px;
  font-size: 12px;
  background-color: #fefefe;
  text-align: left;
  margin-right: 15px;
  min-width: 50px;
  .cross-icon {
    display: inline-block;
    height: 8px;
    margin-left: 5px;
    cursor: pointer;
  }
  ${props =>
    props.active &&
    `
    border-bottom: 1px solid black;
  `}
  p {
    cursor: pointer;
    display: inline-block;
    margin: 0px;
  }
  outline: none;
`

export const OrderNumCell = styled(Text)`
  z-index: 1000;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  &:hover {
    color: #454b54;
  }
  ${props => props.isCanceled && "text-decoration: line-through;"}
`

const allowedFilters = [
  "status",
  "fulfillment_status",
  "payment_status",
  "status[]",
  "fulfillment_status[]",
  "payment_status[]",
  "created_at[lt]",
  "created_at[lte]",
  "created_at[gt]",
  "created_at[gte]",
  "q",
  "offset",
  "limit",
]

const OrderIndex = ({}) => {
  let filtersOnLoad = { offset: undefined, limit: undefined }

  filtersOnLoad = prepareSearchParams(window.location.search.substring(1), {})

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 20
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
      ...defaultQueryProps,
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
  const [query, setQuery] = useState(null)
  const [limit, setLimit] = useState(filtersOnLoad.limit || 20)
  const [offset, setOffset] = useState(filtersOnLoad.offset || 0)
  const [orders, setOrders] = useState([])
  const [filterTabs, setFilterTabs] = useState()
  const [activeFilterTab, setActiveFilterTab] = useState("all")
  const [fetching, setFetching] = useState(false)
  const [showNewOrder, setShowNewOrder] = useState(false)

  const [statusFilter, setStatusFilter] = useState({
    open: false,
    filter: null,
  })
  const [fulfillmentFilter, setFulfillmentFilter] = useState({
    open: false,
    filter: null,
  })
  const [paymentFilter, setPaymentFilter] = useState({
    open: false,
    filter: null,
  })

  const [dateFilter, setDateFilter] = useState({
    open: false,
    filter: null,
  })

  const resetFilters = () => {
    setStatusFilter({
      open: false,
      filter: null,
    })
    setFulfillmentFilter({
      open: false,
      filter: null,
    })
    setPaymentFilter({
      open: false,
      filter: null,
    })
    setDateFilter({
      open: false,
      filter: null,
    })
  }

  useEffect(() => {
    decideTab()
  }, [])

  function prepareSearchParams(str, queryParts = {}) {
    const fs = qs.parse(str)

    for (const [key, value] of Object.entries(fs)) {
      if (key.startsWith("created_at")) {
        fs[key] = formatDateFilter(value) || null
      }
    }

    const stringifiedFilters = qs.stringify({ ...fs, ...queryParts })
    const toSend = queryString.parse(stringifiedFilters)

    return toSend
  }

  const deconstructQueryString = () => {
    const queries = decodeURIComponent(window.location.search.substring(1))
    const filters = {}

    let createdFilters = []
    queries.split("&").map(query => {
      const [k, v] = query.split("=")
      if (allowedFilters.includes(k)) {
        if (k.startsWith("fulfillment"))
          setFulfillmentFilter({ open: true, filter: v })
        if (k.startsWith("payment")) setPaymentFilter({ open: true, filter: v })
        if (k.startsWith("status")) setStatusFilter({ open: true, filter: v })
        if (k.startsWith("created_at")) createdFilters.push(v)
        filters[k] = v
      }

      if (createdFilters.length) {
        setDateFilter({ open: true, filter: createdFilters.join(",") })
      }
    })

    return filters
  }

  const decideTab = () => {
    const filtersFromUrl = deconstructQueryString()
    const savedTabs = getLocalStorageFilters()

    const existsInSaved = savedTabs.find(
      el => el.value === qs.stringify(filtersFromUrl)
    )

    if (existsInSaved) {
      setActiveFilterTab(existsInSaved)
      return
    }

    switch (true) {
      case filtersFromUrl["fulfillment_status[]"] === "shipped" &&
        filtersFromUrl["payment_status[]"] === "captured":
        setActiveFilterTab("completed")
        break
      case (filtersFromUrl["fulfillment_status[]"] ===
        "not_fulfilled,fulfilled" ||
        filtersFromUrl["fulfillment_status[]"] === "fulfilled,not_fulfilled") &&
        (filtersFromUrl["payment_status"] === "awaiting" ||
          filtersFromUrl["payment_status[]"] === "awaiting"):
        setActiveFilterTab("incomplete")
        break
      default:
        break
    }
  }

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

  useEffect(() => {
    const savedTabs = getLocalStorageFilters()
    setFilterTabs(savedTabs)
  }, [])

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
    resetFilters()
    handleTabClick("all", { q: query })
  }

  function formatDateFilter(filter) {
    let dateFormatted = Object.entries(filter).reduce((acc, [key, value]) => {
      if (value.includes("|")) {
        acc[key] = relativeDateFormatToTimestamp(value)
      } else {
        acc[key] = value
      }
      return acc
    }, {})

    return dateFormatted
  }

  const handlePagination = direction => {
    const updatedOffset =
      direction === "next"
        ? parseInt(offset) + parseInt(limit)
        : parseInt(offset) - parseInt(limit)

    handleTabClick(activeFilterTab, {
      offset: updatedOffset,
    }).then(() => {
      setOffset(updatedOffset)
    })
  }

  const handleQueryParts = () => {
    // if the datefilter includes "|" it is a relative date and we have to format it to timestamp
    const queryParts = {}

    if (!_.isEmpty(dateFilter.filter)) {
      let dateFormatted = formatDateFilter(dateFilter.filter)
      queryParts.created_at = dateFormatted
    }

    if (query) {
      queryParts.q = query
    }

    if (paymentFilter.filter) {
      queryParts["payment_status[]"] = paymentFilter.filter
    }

    if (fulfillmentFilter.filter) {
      queryParts["fulfillment_status[]"] = fulfillmentFilter.filter
    }

    if (statusFilter.filter) {
      queryParts["status[]"] = statusFilter.filter
    }

    return queryParts
  }

  const submit = () => {
    const url = qs.stringify(
      {
        "payment_status[]": paymentFilter.filter,
        "fulfillment_status[]": fulfillmentFilter.filter,
        "status[]": statusFilter.filter,
        created_at: dateFilter.filter,
      },
      { skipNulls: true }
    )

    handleTabClick({ value: url }, handleQueryParts())
  }

  const replaceQueryString = queryObject => {
    let params = ""
    if (_.isEmpty(queryObject)) {
      window.history.replaceState(
        `/a/orders`,
        "",
        `?offset=${offset}&limit=${limit}`
      )
      resetFilters()
    } else {
      const clean = removeNullish(queryObject)
      const query = { offset: offset || 0, ...clean }

      params = Object.entries(query)
        .map(([k, v]) => {
          if (k === "created_at") {
            return qs.stringify({ [k]: v })
          } else {
            return `${k}=${v}`
          }
        })
        .filter(s => !!s)
        .join("&")

      window.history.replaceState(`/a/orders`, "", `${`?${params}`}`)
    }

    return params
  }

  const handleTabClick = async (tab, queryParts = {}) => {
    setFetching(true)
    resetFilters()

    let searchObject = {
      ...queryParts,
      ...defaultQueryProps,
    }

    setActiveFilterTab(tab)

    switch (tab) {
      case "completed":
        setQuery("")
        searchObject["fulfillment_status[]"] = "shipped"
        searchObject["payment_status[]"] = "captured"
        break
      case "incomplete":
        setQuery("")
        searchObject["fulfillment_status[]"] = ["not_fulfilled", "fulfilled"]
        searchObject["payment_status[]"] = "awaiting"
        break
      case "all":
        break
      default:
        setQuery("")
        const toSend = prepareSearchParams(tab.value, queryParts)

        if (!tab.value) {
          replaceQueryString(toSend)
        } else {
          window.history.replaceState(
            `/a/orders`,
            ``,
            `?${tab.value}&offset=${offset}&limit=${limit}`
          )
        }

        decideTab()
        refresh({ search: { offset, limit, ...toSend, ...defaultQueryProps } })
        setFetching(false)
        return
    }

    const urlFilters = _.pick(searchObject, allowedFilters)

    if (!urlFilters.offset) {
      urlFilters.offset = 0
    }

    if (!urlFilters.limit) {
      urlFilters.limit = 20
    }

    replaceQueryString(urlFilters)

    refresh({ search: { ...urlFilters, ...defaultQueryProps } })
    decideTab()
    setFetching(false)
  }

  const clear = () => {
    const baseUrl = qs.parse(window.location.href).url
    setQuery("")
    window.history.replaceState(baseUrl, "", `?limit=${limit}&offset=${offset}`)
    refresh()
  }

  const getLocalStorageFilters = () => {
    const filters = JSON.parse(localStorage.getItem("orders::filters"))

    if (filters) {
      const array = Object.entries(filters).map(([key, value]) => {
        return { label: key, value: value }
      })

      return array
    }

    return []
  }

  const handleSaveTab = saveValue => {
    const localStorageUrl = qs.stringify(
      {
        "payment_status[]": paymentFilter.filter,
        "fulfillment_status[]": fulfillmentFilter.filter,
        "status[]": statusFilter.filter,
        created_at: dateFilter.filter,
      },
      { skipNulls: true }
    )

    const filters = JSON.parse(localStorage.getItem("orders::filters"))

    if (filters) {
      filters[saveValue] = localStorageUrl
      localStorage.setItem("orders::filters", JSON.stringify(filters))
    } else {
      const newFilters = {}
      newFilters[saveValue] = localStorageUrl
      localStorage.setItem("orders::filters", JSON.stringify(newFilters))
    }

    let newTabs = [...getLocalStorageFilters()]
    setFilterTabs(newTabs)

    handleTabClick(
      { label: saveValue, value: localStorageUrl },
      handleQueryParts()
    )
  }

  const handleDeleteFilter = (tab, e) => {
    e.stopPropagation()
    const newTabs = JSON.parse(localStorage.getItem("orders::filters"))

    delete newTabs[tab.label]

    localStorage.setItem("orders::filters", JSON.stringify(newTabs))

    resetFilters()
    setFilterTabs(getLocalStorageFilters())
    handleTabClick("all")
  }

  const moreResults = orders && orders.length >= limit

  return (
    <Flex flexDirection="column" pb={5} pt={5}>
      <Flex>
        <Text mb={3} fontSize={20} fontWeight="bold">
          Orders
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
        <Box ml="auto" />
        <Filter
          submitFilters={submit}
          clearFilters={clear}
          statusFilter={statusFilter}
          fulfillmentFilter={fulfillmentFilter}
          paymentFilter={paymentFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          setStatusFilter={setStatusFilter}
          setPaymentFilter={setPaymentFilter}
          setFulfillmentFilter={setFulfillmentFilter}
          resetFilters={resetFilters}
          handleSaveTab={value => handleSaveTab(value)}
        />
        <Button ml={2} onClick={() => setShowNewOrder(true)} variant={"cta"}>
          New draft order
        </Button>
      </Flex>
      <Flex mb={3} sx={{ borderBottom: "1px solid hsla(0, 0%, 0%, 0.12)" }}>
        <TabButton
          active={"all" === activeFilterTab}
          onClick={() => handleTabClick("all")}
        >
          <p>All</p>
        </TabButton>
        <TabButton
          active={"incomplete" === activeFilterTab}
          onClick={() => handleTabClick("incomplete")}
        >
          <p>Incomplete</p>
        </TabButton>
        <TabButton
          active={"completed" === activeFilterTab}
          onClick={() => handleTabClick("completed")}
        >
          <p>Completed</p>
        </TabButton>
        <Box ml="auto" />
        <Flex fontSize="10px" alignItems="flex-end" mr={2}>
          <Text color="#c4c4c4">SAVED FILTERS</Text>
        </Flex>
        <Flex overflowY="scroll" maxWidth="50%" maxHeight="30px">
          {filterTabs &&
            filterTabs.map((tab, i) => (
              <TabButton
                key={i}
                active={tab.label === activeFilterTab.label}
                onClick={() => handleTabClick(tab)}
              >
                <Text
                  height="25px"
                  sx={{
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {tab.label}
                </Text>
                <Cross
                  className="cross-icon"
                  onClick={e => handleDeleteFilter(tab, e)}
                  data-for={tab.value}
                  data-tip="Delete filter"
                />
                <ReactTooltip id={tab.value} place="top" effect="solid" />
              </TabButton>
            ))}
        </Flex>
      </Flex>
      {(isLoading && !hasCache) || isReloading || fetching ? (
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
              <TableHeaderCell sx={{ textAlign: "right" }}>
                Total
              </TableHeaderCell>
              <TableHeaderCell sx={{ maxWidth: "75px" }} />
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {orders.map((el, i) => {
              return (
                <TableLinkRow
                  key={i}
                  to={`/a/orders/${el.id}`}
                  id={`order-${el.id}`}
                  isHighlighted={i === activeIndex}
                >
                  <TableDataCell>
                    <OrderNumCell
                      fontWeight={500}
                      color={"link"}
                      isCanceled={el.status === "canceled"}
                    >
                      #{el.display_id}
                    </OrderNumCell>
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
                    <DefaultCellContent>{el.email}</DefaultCellContent>
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
                    <DefaultCellContent>
                      <Box sx={{ width: "100%", textAlign: "right" }}>
                        {displayAmount(el.currency_code, el.total)}{" "}
                        {el.currency_code.toUpperCase()}
                      </Box>
                    </DefaultCellContent>
                  </TableDataCell>
                  <TableDataCell maxWidth="75px">
                    {el.shipping_address?.country_code ? (
                      <DefaultCellContent>
                        <ReactCountryFlag
                          style={{ maxHeight: "100%", marginBottom: "0px" }}
                          svg
                          countryCode={el.shipping_address.country_code}
                        />
                      </DefaultCellContent>
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
          refresh={() => navigate(`/a/draft-orders`)}
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
