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
  TableBody,
  TableRow,
  TableDataCell,
} from "../../components/table"
import Spinner from "../../components/spinner"
import Badge from "../../components/badge"
import Button from "../../components/button"

import useMedusa from "../../hooks/use-medusa"

const Index = () => {
  const { gift_cards, isLoading } = useMedusa("giftCards")

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
            {gift_cards &&
              gift_cards.map(el => (
                <TableRow
                  sx={{ cursor: "pointer" }}
                  key={el.id}
                  onClick={() => navigate(`/a/gift-cards/${el.id}`)}
                >
                  <TableDataCell>{el.code}</TableDataCell>
                  <TableDataCell>
                    {(el.value &&
                      (
                        ((1 + el.region.tax_rate / 100) * el.value) /
                        100
                      ).toFixed(2)) || <>&nbsp;</>}{" "}
                    {el.value && el.region.currency_code.toUpperCase()}
                  </TableDataCell>
                  <TableDataCell>
                    {(
                      ((1 + el.region.tax_rate / 100) * el.balance) /
                      100
                    ).toFixed(2)}{" "}
                    {el.region.currency_code.toUpperCase()}
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
