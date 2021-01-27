import React, { useEffect, useRef, useState } from "react"
import qs from "query-string"
import { Router } from "@reach/router"
import { Text, Box, Flex } from "rebass"
import New from "./new"
import Details from "./details"

import useMedusa from "../../hooks/use-medusa"

import {
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableDataCell,
} from "../../components/table"
import Spinner from "../../components/spinner"
import Badge from "../../components/badge"
import { navigate } from "gatsby"
import Button from "../../components/button"
import { Checkbox, Input, Label } from "@rebass/forms"

const DiscountIndex = () => {
  const filtersOnLoad = qs.parse(window.location.search)

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 20
  }

  const { discounts, refresh, isReloading, isLoading } = useMedusa(
    "discounts",
    {
      search: {
        is_giftcard: "false",
        is_dynamic: "false",
        ...filtersOnLoad,
      },
    }
  )

  const [query, setQuery] = useState("")
  const [limit, setLimit] = useState(filtersOnLoad.limit || 0)
  const [offset, setOffset] = useState(filtersOnLoad.offset || 0)
  const [showDynamic, setShowDynamic] = useState(false)

  const searchRef = useRef(null)

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
        is_giftcard: "false",
        is_dynamic: showDynamic,
        ...queryParts,
      },
    })
  }

  useEffect(() => {
    handleCheckbox()
  }, [showDynamic])

  const handleCheckbox = () => {
    setOffset(0)
    const baseUrl = qs.parseUrl(window.location.href).url

    const queryParts = {
      is_dynamic: showDynamic,
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
        is_giftcard: "false",
        ...queryParts,
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
      offset: updatedOffset,
      limit,
    }

    const prepared = qs.stringify(queryParts, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.replaceState(baseUrl, "", `?${prepared}`)

    refresh({ search: { ...queryParts, is_giftcard: "false" } }).then(() => {
      setOffset(updatedOffset)
    })
  }

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

  const moreResults = discounts && discounts.length >= limit

  return (
    <Flex flexDirection="column" pt={5} pb={5}>
      <Flex>
        <Text mb={4} fontSize={20} fontWeight="bold">
          Discounts
        </Text>
        <Box ml="auto" />
        <Button onClick={() => navigate(`/a/discounts/new`)} variant={"cta"}>
          New discount
        </Button>
      </Flex>
      <Flex>
        <Flex maxHeight="18px" alignItems="center">
          <Label fontSize={0} height="18px" alignItems="center">
            <Checkbox
              id="is_dynamic"
              name="is_dynamic"
              height="18px"
              width="18px"
              onChange={() => setShowDynamic(!showDynamic)}
            />
            Show dynamic discounts
          </Label>
        </Flex>
        <Box ml="auto" />
        <Box mb={3} sx={{ maxWidth: "300px" }} mr={2}>
          <Input
            ref={searchRef}
            height="28px"
            fontSize="12px"
            id="email"
            name="q"
            type="text"
            placeholder="Search discounts"
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
      {isLoading || isReloading ? (
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
      ) : (
        <Table>
          <TableHead>
            <TableRow
              p={0}
              sx={{
                background: "white",
              }}
            >
              <TableHeaderCell>Code</TableHeaderCell>
              <TableHeaderCell>Rule</TableHeaderCell>
              <TableHeaderCell>Starts at</TableHeaderCell>
              <TableHeaderCell>Ends at</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discounts &&
              discounts.map((el, i) => (
                <TableRow
                  sx={{ cursor: "pointer" }}
                  key={i}
                  onClick={() => navigate(`/a/discounts/${el.id}`)}
                >
                  <TableDataCell>{el.code}</TableDataCell>
                  <TableDataCell>{el.rule.description}</TableDataCell>
                  <TableDataCell>
                    {new Date(el.starts_at).toDateString()}
                  </TableDataCell>
                  <TableDataCell>
                    {el.ends_at ? new Date(el.ends_at).toDateString() : "-"}
                  </TableDataCell>
                </TableRow>
              ))}
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

const Discounts = () => {
  return (
    <Router>
      <DiscountIndex path="/" />
      <Details path=":id" />
      <New path="new" />
    </Router>
  )
}

export default Discounts
