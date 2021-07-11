import React, { useState, useEffect } from "react"
import { Router } from "@reach/router"
import { navigate } from "gatsby"
import qs from "query-string"
import { Text, Flex, Box } from "rebass"
import { Input } from "@rebass/forms"
import ReactTooltip from "react-tooltip"
import moment from "moment"
import { OrderNumCell } from "../orders"

import ManageGiftCard from "./manage"
import GiftCardDetail from "./detail"

import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableDataCell,
  TableHeaderRow,
  DefaultCellContent,
} from "../../components/table"
import Spinner from "../../components/spinner"
import Badge from "../../components/badge"
import Button from "../../components/button"
import useMedusa from "../../hooks/use-medusa"

const Index = () => {
  const { gift_cards, isLoading, refresh } = useMedusa("giftCards")
  const [query, setQuery] = useState("")

  const searchQuery = () => {
    const baseUrl = qs.parseUrl(window.location.href).url

    const search = {
      fields: "id,title,thumbnail",
      expand: "variants,variants.prices,collection",
      q: query,
      offset: 0,
      limit: 20,
    }

    const prepared = qs.stringify(search, {
      skipNull: true,
      skipEmptyString: true,
    })

    window.history.replaceState(baseUrl, "", `?${prepared}`)
    refresh({ search })
  }

  const onKeyDown = event => {
    // 'keypress' event misbehaves on mobile so we track 'Enter' key via 'keydown' event
    if (event.key === "Enter") {
      event.preventDefault()
      event.stopPropagation()
      searchQuery()
    }
  }

  return (
    <div>
      <Flex pt={5}>
        <Text fontSize={20} fontWeight="bold" mb={4}>
          Gift cards
        </Text>
        <Box ml="auto" />
        <Button
          onClick={() => navigate(`/a/gift-cards/manage`)}
          variant={"cta"}
        >
          Manage gift cards
        </Button>
      </Flex>
      <Flex>
        <Box mb={3} sx={{ maxWidth: "300px" }}>
          <Input
            height="28px"
            fontSize="12px"
            name="q"
            type="text"
            placeholder="Search gift cards"
            onKeyDown={onKeyDown}
            onChange={e => setQuery(e.target.value)}
            value={query}
          />
        </Box>
        <Button
          onClick={() => searchQuery()}
          variant={"primary"}
          fontSize="12px"
          ml={2}
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
              <TableHeaderCell>Code</TableHeaderCell>
              <TableHeaderCell>Order</TableHeaderCell>
              <TableHeaderCell>Original Amount</TableHeaderCell>
              <TableHeaderCell>Amount Left</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {gift_cards &&
              gift_cards.map(el => (
                <TableRow
                  key={el.id}
                  onClick={() => navigate(`/a/gift-cards/${el.id}`)}
                >
                  <TableDataCell>
                    <DefaultCellContent>{el.code}</DefaultCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    {el.order && (
                      <OrderNumCell
                        onClick={e => {
                          navigate(`/a/orders/${el.order.id}`)
                          e.stopPropagation()
                        }}
                        fontWeight={500}
                        color={"link"}
                        isCanceled={el.order.status === "canceled"}
                      >
                        #{el.order.display_id}
                      </OrderNumCell>
                    )}
                  </TableDataCell>
                  <TableDataCell>
                    <DefaultCellContent>
                      {(el.value &&
                        (
                          ((1 + el.region.tax_rate / 100) * el.value) /
                          100
                        ).toFixed(2)) || <>&nbsp;</>}{" "}
                      {el.value && el.region.currency_code.toUpperCase()}
                    </DefaultCellContent>
                  </TableDataCell>
                  <TableDataCell>
                    <DefaultCellContent>
                      {(
                        ((1 + el.region.tax_rate / 100) * el.balance) /
                        100
                      ).toFixed(2)}{" "}
                      {el.region.currency_code.toUpperCase()}
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
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}

const GiftCard = () => {
  return (
    <Router>
      <Index path="/" />
      <ManageGiftCard path="manage" />
      <GiftCardDetail path=":id" />
    </Router>
  )
}

export default GiftCard
