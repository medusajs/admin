import styled from "@emotion/styled"
import { Router } from "@reach/router"
import { navigate } from "gatsby"
import { isEmpty, omit, pick } from "lodash"
import { useAdminOrders } from "medusa-react"
import moment from "moment"
import qs from "qs"
import React, { useContext, useEffect, useRef, useState } from "react"
import ReactCountryFlag from "react-country-flag"
import { useHotkeys } from "react-hotkeys-hook"
import ReactTooltip from "react-tooltip"
import { Box, Flex, Text } from "rebass"
import { ReactComponent as Cross } from "../../assets/svg/cross.svg"
import Button from "../../components/button"
import Badge from "../../components/fundamentals/badge"
import Spinner from "../../components/spinner"
import {
  BadgdeCellContent,
  DefaultCellContent,
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeaderCell,
  TableHeaderRow,
  TableLinkRow,
} from "../../components/table"
import { InterfaceContext } from "../../context/interface"
import { decideBadgeColor } from "../../utils/decide-badge-color"
import { displayAmount } from "../../utils/prices"
import Details from "./details"
import DraftOrderDetails from "./draft-orders/details"
import Filter from "./filter-dropdown"
import New from "./new"
import NewOrder from "./new/new-order"
import { useOrderFilters } from "./use-order-filters"

const defaultQueryProps = {
  expand: "shipping_address",
  fields:
    "id,status,display_id,created_at,email,fulfillment_status,payment_status,total,currency_code",
}

const removeNullish = (obj) =>
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
  ${(props) =>
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
  ${(props) => props.isCanceled && "text-decoration: line-through;"}
`

const OrderIndex = () => {
  const {
    status: statusFilter,
    fulfillment: fulfillmentFilter,
    payment: paymentFilter,
    date: dateFilter,
    reset: resetFilters,
    setDateFilter,
    setFulfillmentFilter,
    setPaymentFilter,
    setStatusFilter,
    queryObject,
    paginate,
    getQueryObject,
    getQueryString,
  } = useOrderFilters(window.location.search.substring(1), defaultQueryProps)

  const filtersOnLoad = queryObject

  const { setOnSearch, onUnmount } = useContext(InterfaceContext)
  useEffect(onUnmount, [])

  const { orders, isLoading, isRefetching, count } = useAdminOrders(queryObject)

  const handleCopyToClip = (val) => {
    const tempInput = document.createElement("input")
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
  const [filterTabs, setFilterTabs] = useState()
  const [activeFilterTab, setActiveFilterTab] = useState("all")
  const [showNewOrder, setShowNewOrder] = useState(false)

  useEffect(() => {
    decideTab()
  }, [queryObject])

  const decideTab = () => {
    const tabRelevant = removeNullish(queryObject)
    const clean = omit(tabRelevant, ["limit", "offset"])

    const savedTabs = getLocalStorageFilters()
    const existsInSaved = savedTabs.find(
      (el) => el.value === qs.stringify(clean)
    )

    if (existsInSaved) {
      setActiveFilterTab(existsInSaved)
      return
    }

    switch (true) {
      case clean.fulfillment_status === ["shipped"] &&
        clean.payment_status === ["captured"]:
        setActiveFilterTab("completed")
        break
      case (clean["fulfillment_status[]"] === "not_fulfilled,fulfilled" ||
        clean["fulfillment_status[]"] === "fulfilled,not_fulfilled") &&
        (clean["payment_status"] === "awaiting" ||
          clean["payment_status[]"] === "awaiting"):
        setActiveFilterTab("incomplete")
        break
      default:
        break
    }
  }

  const isInViewport = (el) => {
    const rect = el.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  const searchHandler = (q) => {
    setOffset(0)
    resetFilters()
    setQuery(q)
    handleTabClick("all", { q })
  }

  useEffect(() => {
    setOnSearch(searchHandler)
  }, [])

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
  useHotkeys("j", () => setActiveIndex((i) => Math.min(i + 1, 50)))
  useHotkeys("k", () => setActiveIndex((i) => Math.max(i - 1, 0)))
  useHotkeys(
    "command+i",
    () => {
      if (activeIndex === -1) {
        return
      }
      const o = orders[activeIndex]
      handleCopyToClip(o.display_id)
    },
    {},
    [activeIndex]
  )
  useHotkeys(
    "enter",
    () => {
      if (activeIndex === -1) {
        return
      }
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
    const savedTabs = getLocalStorageFilters()
    setFilterTabs(savedTabs)
  }, [])

  const handlePagination = (direction) => {
    paginate(direction === "next" ? 1 : -1)
  }

  const submit = () => {
    handleTabClick({ value: getQueryString() }, getQueryObject())
  }

  const replaceQueryString = (queryObject) => {
    if (isEmpty(queryObject)) {
      window.history.replaceState(
        `/a/orders`,
        "",
        `?offset=${offset}&limit=${limit}`
      )
      resetFilters()
    } else {
      window.history.replaceState(`/a/orders`, "", `${`?${params}`}`)
    }

    return params
  }

  const handleTabClick = async (tab, queryParts = {}) => {
    resetFilters()

    const searchObject = {
      q: query,
      ...queryParts,
      ...defaultQueryProps,
    }

    setActiveFilterTab(tab)

    switch (tab) {
      case "completed":
        searchObject["fulfillment_status[]"] = "shipped"
        searchObject["payment_status[]"] = "captured"
        break
      case "incomplete":
        searchObject["fulfillment_status[]"] = ["not_fulfilled", "fulfilled"]
        searchObject["payment_status[]"] = "awaiting"
        break
      case "all":
        break
      default:
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

    const urlFilters = pick(searchObject, allowedFilters)

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
    // setQuery("")
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

  const handleSaveTab = (saveValue) => {
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

    const newTabs = [...getLocalStorageFilters()]
    setFilterTabs(newTabs)

    handleTabClick(
      { label: saveValue, value: localStorageUrl },
      getQueryObject()
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
      <Flex sx={{ justifyContent: "space-between", width: "100%", mb: 2 }}>
        <Flex>
          <Text fontSize={20} fontWeight="bold">
            Orders
          </Text>
        </Flex>
        <Flex>
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
            handleSaveTab={(value) => handleSaveTab(value)}
          />
          <Button ml={2} onClick={() => setShowNewOrder(true)} variant={"cta"}>
            New draft order
          </Button>
        </Flex>
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
                  onClick={(e) => handleDeleteFilter(tab, e)}
                  data-for={tab.value}
                  data-tip="Delete filter"
                />
                <ReactTooltip id={tab.value} place="top" effect="solid" />
              </TabButton>
            ))}
        </Flex>
      </Flex>
      {isLoading ? (
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
