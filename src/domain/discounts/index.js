import React from "react"
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

const DiscountIndex = () => {
  const { discounts, isLoading } = useMedusa("discounts", {
    search: {
      is_giftcard: "false",
    },
  })

  return (
    <>
      <Flex pt={5}>
        <Text mb={4} fontSize={20} fontWeight="bold">
          Discounts
        </Text>
        <Box ml="auto" />
        <Button onClick={() => navigate(`/a/discounts/new`)} variant={"cta"}>
          New discount
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
              <TableHeaderCell>Rule</TableHeaderCell>
              <TableHeaderCell>Starts at</TableHeaderCell>
              <TableHeaderCell>Ends at</TableHeaderCell>
              <TableHeaderCell>Disabled</TableHeaderCell>
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
                  <TableDataCell>{el.discount_rule.description}</TableDataCell>
                  <TableDataCell>{new Date().toLocaleString()}</TableDataCell>
                  <TableDataCell>{new Date().toLocaleString()}</TableDataCell>
                  <TableDataCell>
                    <Box>
                      <Badge color="#4f566b" bg="#e3e8ee">
                        {`${el.is_disabled}`}
                      </Badge>
                    </Box>
                  </TableDataCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </>
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
