import React, { useState, useEffect } from "react"
import { Router } from "@reach/router"
import { navigate } from "gatsby"
import qs from "query-string"
import { Text, Flex, Box } from "rebass"
import ReactTooltip from "react-tooltip"
import moment from "moment"

import ManageGiftCard from "./manage"
import GiftCardDetail from "./detail"

import {
  Table,
  TableHead,
  TableHeaderCell,
  TableHeaderRow,
  TableBody,
  TableRow,
  TableDataCell,
} from "../../components/table"
import Spinner from "../../components/spinner"
import Badge from "../../components/badge"
import Button from "../../components/button"

import useMedusa from "../../hooks/use-medusa"

const Index = () => {
  const { discounts, isLoading } = useMedusa("discounts", {
    search: {
      is_giftcard: "true",
      expand_fields: "regions",
    },
  })

  return (
    <div>
      <Flex>
        <Text mb={4}>Gift Cards</Text>
        <Box ml="auto" />
        <Button
          onClick={() => navigate(`/a/gift-cards/manage`)}
          variant={"cta"}
        >
          Manage Gift Card
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
            <TableRow
              p={0}
              sx={{
                background: "white",
              }}
            >
              <TableHeaderCell>Code</TableHeaderCell>
              <TableHeaderCell>Original Amount</TableHeaderCell>
              <TableHeaderCell>Amount Left</TableHeaderCell>
              <TableHeaderCell>Created</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {discounts &&
              discounts.map((el, i) => (
                <TableRow
                  sx={{ cursor: "pointer" }}
                  key={i}
                  onClick={() => navigate(`/a/gift-cards/${el._id}`)}
                >
                  <TableDataCell>{el.code}</TableDataCell>
                  <TableDataCell>
                    {(el.original_amount && el.original_amount.toFixed(2)) || (
                      <>&nbsp;</>
                    )}{" "}
                    {el.original_amount && el.regions[0].currency_code}
                  </TableDataCell>
                  <TableDataCell>
                    {(el.discount_rule.value || 0).toFixed(2)}{" "}
                    {el.regions[0].currency_code}
                  </TableDataCell>
                  <TableDataCell
                    data-for={el._id}
                    data-tip={moment(el.created).format("MMMM Do YYYY HH:mm a")}
                  >
                    <ReactTooltip id={el._id} place="top" effect="solid" />
                    {moment(parseInt(el.created)).format("MMM Do YYYY")}
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
