import React, { useState, useCallback, useEffect } from "react"
import { navigate } from "gatsby"
import { Router } from "@reach/router"
import { Input } from "@rebass/forms"
import { Text, Flex, Box } from "rebass"
import qs from "query-string"
import Details from "./details"

import useMedusa from "../../hooks/use-medusa"

import {
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableDataCell,
  TableHeaderRow,
  DefaultCellContent,
  BadgdeCellContent,
} from "../../components/table"
import Button from "../../components/button"
import Spinner from "../../components/spinner"
import Badge from "../../components/badge"
import { decideBadgeColor } from "../../utils/decide-badge-color"

const CustomerIndex = () => {
  const filtersOnLoad = qs.parse(window.location.search)

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 20
  }

  const { customers, isLoading, refresh, total_count } = useMedusa(
    "customers",
    {
      search: `?${qs.stringify(filtersOnLoad)}`,
    }
  )
  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(20)
  const [query, setQuery] = useState("")

  const onKeyDown = event => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === "Enter") {
      event.preventDefault()
      event.stopPropagation()
      searchQuery()
    }
  }

  const searchQuery = () => {
    setOffset(0)
    const baseUrl = qs.parseUrl(window.location.href).url

    const prepared = qs.stringify(
      {
        q: query,
        offset: 0,
        limit,
      },
      { skipNull: true, skipEmptyString: true }
    )

    window.history.pushState(baseUrl, "", `?${prepared}`)
    refresh({ search: `?${prepared}` })
  }

  const handlePagination = direction => {
    const updatedOffset = direction === "next" ? offset + limit : offset - limit
    const baseUrl = qs.parseUrl(window.location.href).url

    const prepared = qs.stringify(
      {
        q: query,
        offset: updatedOffset,
        limit,
      },
      { skipNull: true, skipEmptyString: true }
    )

    window.history.pushState(baseUrl, "", `?${prepared}`)

    refresh({ search: `?${prepared}` }).then(() => {
      setOffset(updatedOffset)
    })
  }

  const moreResults = customers && customers.length >= limit

  return (
    <Flex flexDirection="column" pb={5} pt={5}>
      <Flex>
        <Text fontSize={20} fontWeight="bold" mb={3}>
          Customers
        </Text>
      </Flex>
      <Flex>
        <Box mb={3} sx={{ maxWidth: "300px" }} mr={2}>
          <Input
            height="30px"
            fontSize="12px"
            name="q"
            type="text"
            placeholder="Search customers"
            onKeyDown={onKeyDown}
            onChange={e => setQuery(e.target.value)}
            value={query}
          />
        </Box>
        <Button
          onClick={() => searchQuery()}
          variant={"primary"}
          fontSize="12px"
        >
          Search
        </Button>
      </Flex>
      {isLoading ? (
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
            <TableHeaderRow>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell sx={{ width: "75px" }} />
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {customers.map((el, i) => {
              const fullName = `${el.first_name || ""} ${el.last_name || ""}`

              return (
                <TableRow
                  key={i}
                  onClick={() => navigate(`/a/customers/${el.id}`)}
                >
                  <TableDataCell>
                    <DefaultCellContent>
                      {el.email ? el.email : "-"}
                    </DefaultCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    <DefaultCellContent>
                      {fullName !== " " ? fullName : "-"}
                    </DefaultCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    {el.has_account ? (
                      <BadgdeCellContent>
                        <Badge color="#ffffff" bg="#4BB543">
                          Signed up
                        </Badge>
                      </BadgdeCellContent>
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

const Customers = () => {
  return (
    <Router>
      <CustomerIndex path="/" />
      <Details path=":id" />
    </Router>
  )
}

export default Customers
