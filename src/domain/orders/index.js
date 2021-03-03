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
} from "../../components/table"
import Badge from "../../components/badge"

import { decideBadgeColor } from "../../utils/decide-badge-color"
import useMedusa from "../../hooks/use-medusa"
import Spinner from "../../components/spinner"
import Button from "../../components/button"
import Filter from "./filter-dropdown"
import { relativeDateFormatToTimestamp } from "../../utils/time"

const defaultQueryProps = {
  expand: "shipping_address",
  fields:
    "id,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code",
}

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

const OrderNumCell = styled(Text)`
  z-index: 1000;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    color: #454b54;
  }

  ${props => props.isCanceled && "text-decoration: line-through;"}
`

const OrderIndex = ({}) => {
  const filtersOnLoad = queryString.parse(window.location.search)

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 50
  }

  const { tab: onLoadTab, ...rest } = filtersOnLoad

  const {
    orders: allOrders,
    hasCache,
    isLoading,
    refresh,
    isReloading,
    toaster,
  } = useMedusa("orders", {
    search: {
      ...rest,
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
  const [limit, setLimit] = useState(rest.limit || 0)
  const [offset, setOffset] = useState(rest.offset || 0)
  const [orders, setOrders] = useState([])
  const [filterTabs, setFilterTabs] = useState()
  const [activeFilterTab, setActiveFilterTab] = useState(onLoadTab || "all")
  const [fetching, setFetching] = useState(false)

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
    filter: {},
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

    const queryParts = {
      q: query,
      offset: 0,
      limit: 50,
    }

    handleTabClick(activeFilterTab, queryParts)
  }

  const formatDateFilter = filter => {
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

    console.log(activeFilterTab)
    handleTabClick(activeFilterTab, {
      offset: updatedOffset,
    }).then(() => {
      setOffset(updatedOffset)
    })
  }

  const handleQueryParts = () => {
    // if the datefilter includes "|" it is a relative date and we have to format it to timestamp

    const queryParts = {
      q: query || "",
      offset,
      limit,
    }

    if (!_.isEmpty(dateFilter.filter)) {
      let dateFormatted = formatDateFilter(dateFilter.filter)
      queryParts.created_at = dateFormatted
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
    handleTabClick(activeFilterTab, handleQueryParts())
  }

  const handleTabClick = async (tab, queryParts = {}) => {
    setFetching(true)
    const baseUrl = qs.parse(window.location.href).url

    let replaceUrl

    if (typeof tab === "object") {
      replaceUrl = `?tab=${tab.label.toLowerCase()}`
      setActiveFilterTab(tab.label)
    } else {
      replaceUrl = `?tab=${tab.toLowerCase()}&${qs.stringify({
        ...queryParts,
      })}`
      setActiveFilterTab(tab)
    }

    switch (tab) {
      case "completed":
        refresh({
          search: {
            ...queryParts,
            ...defaultQueryProps,
            fulfillment_status: "shipped",
            payment_status: "captured",
          },
        })
        setOrders(allOrders)
        break
      case "incomplete":
        refresh({
          search: {
            ...queryParts,
            ...defaultQueryProps,
            "fulfillment_status[]": ["not_fulfilled", "fulfilled"],
            payment_status: "awaiting",
          },
        })
        setOrders(allOrders)
        break
      case "all":
        refresh({
          search: {
            ...queryParts,
            ...defaultQueryProps,
          },
        })
        setOrders(allOrders)
        break
      default:
        const fs = qs.parse(tab.value)

        for (const [key, value] of Object.entries(fs)) {
          if (key === "created_at") {
            fs[key] = formatDateFilter(value) || null
          }
        }

        setActiveFilterTab(tab)

        const stringifiedFilters = qs.stringify({ ...fs, ...queryParts })
        const toSend = queryString.parse(stringifiedFilters)

        const search = {
          ...toSend,
          ...defaultQueryProps,
        }

        refresh({ search })

        replaceUrl = `?${stringifiedFilters}`
        break
    }

    window.history.replaceState(baseUrl, "", replaceUrl)
    setOrders(allOrders)
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
        q: query,
        "payment_status[]": paymentFilter.filter,
        "fulfillment_status[]": fulfillmentFilter.filter,
        "status[]": statusFilter.filter,
        created_at: dateFilter.filter,
        offset,
        limit,
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

    handleTabClick({ label: saveValue }, handleQueryParts())
  }

  const handleDeleteFilter = (tab, e) => {
    e.stopPropagation()
    const newTabs = JSON.parse(localStorage.getItem("orders::filters"))

    delete newTabs[tab.label]

    localStorage.setItem("orders::filters", JSON.stringify(newTabs))

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
          handleSaveTab={value => handleSaveTab(value)}
        />
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
                    {moment(el.created_at).format("MMM Do YYYY")}
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
                    {(el.total / 100).toFixed(2)}{" "}
                    {el.currency_code.toUpperCase()}
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
