import React, { useEffect } from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import { navigate } from "gatsby"
import { Box, Flex, Text } from "rebass"
import styled from "@emotion/styled"
import useMedusa from "../../hooks/use-medusa"
import { atMidnight, dateToUnixTimestamp, addHours } from "../../utils/time"
import Spinner from "../../components/spinner"

const HorizontalDivider = props => (
  <Box
    {...props}
    as="hr"
    m={props.m}
    sx={{
      bg: "#e3e8ee",
      border: 0,
      height: 1,
    }}
  />
)

const VerticalDivider = props => (
  <Box
    {...props}
    sx={{
      boxShadow: "inset -1px 0 #e3e8ee",
      width: "1px",
    }}
  />
)

const StyledImg = styled.img`
  height: 20px;
  width: 20px;
  margin: 0px;
  margin-right: 8px;
`

const StyledLinkText = styled(Text)`
  cursor: pointer;
  font-weight: 500;
  color: link;

  &:hover: {
    color: medusa;
  }
`

const SubTitle = styled(Text)`
  font-size: 18px;
  font-weight: 500;
  display: flex;

  align-items: center;
`

const SettingContainer = styled(Flex)`
  min-height: 120px;
  border-right: 1px solid #e3e8ee;
  flex-direction: ${props =>
    props.flexDirection ? props.flexDirection : "column"};
`

const GoTo = styled.span`
  cursor: pointer;
  color: #5469d4;
  font-weight: 600;
`

const Overview = () => {
  const getToday = () => {
    let value = Date.now()
    value = atMidnight(value)
    let day = dateToUnixTimestamp(value.toDate())
    let nextDay = dateToUnixTimestamp(addHours(value, 24).toDate())
    return { gt: day, lt: nextDay }
  }

  const {
    orders: incompleteOrders,
    isLoading: isLoadingIncomplete,
  } = useMedusa("orders", {
    search: {
      fields: "id",
      ["fulfillment_status[]"]: ["not_fulfilled", "fulfilled"],
      ["payment_status[]"]: "awaiting",
    },
  })

  const { orders: ordersToday, isLoading: isLoadingToday } = useMedusa(
    "orders",
    {
      search: {
        fields: "id",
        ["created_at[gt]"]: getToday().gt,
        ["created_at[lt]"]: getToday().lt,
      },
    }
  )

  return (
    <>
      <SEO title="Home" />
      <Flex flexDirection={"column"} pb={5} pt={5}>
        <Flex flexDirection="column" mb={5}>
          <Text mb={1} fontSize={20} fontWeight="bold">
            Overview
          </Text>
          <Text mb={3} fontSize={14}>
            Here are some general information about your store operations
          </Text>
        </Flex>
        <HorizontalDivider />
        {isLoadingIncomplete || isLoadingToday ? (
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
        ) : (
          <Flex flexDirection="row" width="100%">
            <Flex flexDirection="column" width="50%">
              <SettingContainer py={4} flexDirection="row">
                <Flex flexDirection="column">
                  <SubTitle>
                    <StyledImg src="https://img.icons8.com/ios/50/000000/total-sales-1.png" />
                    Sales
                  </SubTitle>
                  <Text fontSize={14}>Today</Text>
                </Flex>
                <Box ml="auto" />
                <Flex pr={4}>
                  <Text fontSize={"36px"} fontWeight="600" pr={2}>
                    $245.42
                  </Text>
                </Flex>
              </SettingContainer>
              <HorizontalDivider />
              <SettingContainer py={4} flexDirection="row">
                <Flex flexDirection="column">
                  <SubTitle>
                    <StyledImg src="https://img.icons8.com/ios/50/000000/purchase-order.png" />
                    Orders
                  </SubTitle>
                  <Text fontSize={14}>Today</Text>
                </Flex>
                <Box ml="auto" />
                <Flex pr={4}>
                  <Text fontSize={"36px"} fontWeight="600" pr={2}>
                    {ordersToday && ordersToday.length}
                  </Text>
                </Flex>
              </SettingContainer>
              <VerticalDivider />
              <Box width="100%" />
              <HorizontalDivider />
              <SettingContainer py={4}>
                <SubTitle mb={2}>
                  <StyledImg src="https://img.icons8.com/ios/50/000000/merchant-account.png" />
                  Actionables
                </SubTitle>
                <Text fontSize={15}>
                  {incompleteOrders && incompleteOrders.length === 50 ? (
                    <b>Over 50 </b>
                  ) : (
                    <b>{incompleteOrders && incompleteOrders.length} </b>
                  )}
                  <GoTo onClick={() => navigate("/a/orders")}>Order(s)</GoTo>{" "}
                  are incomplete
                </Text>
                {/* <Text fontSize={15}>
                  <b>14</b>{" "}
                  <GoTo onClick={() => navigate("/a/products")}>
                    Product(s)
                  </GoTo>{" "}
                  are out of stock
                </Text> */}
              </SettingContainer>
            </Flex>
            <Flex flexDirection="column" width="50%">
              <Flex flexDirection="column" p={4}>
                <SubTitle>
                  <StyledImg src="https://img.icons8.com/ios/50/000000/activity-history.png" />
                  Order history
                </SubTitle>
                <Text fontSize={14}>Today</Text>
              </Flex>
            </Flex>
          </Flex>
        )}
      </Flex>
    </>
  )
}

export default Overview
