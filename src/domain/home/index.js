import React, { useEffect } from "react"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import { navigate } from "gatsby"
import { Box, Flex, Text } from "rebass"
import styled from "@emotion/styled"
import useMedusa from "../../hooks/use-medusa"
import { atMidnight, dateToUnixTimestamp, addHours } from "../../utils/time"

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
  width: 50%;
  min-height: 120px;
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

  const { orders: incompleteOrders } = useMedusa("orders", {
    search: {
      fields: "id",
      ["fulfillment_status[]"]: ["not_fulfilled", "fulfilled"],
      ["payment_status[]"]: "awaiting",
    },
  })

  const { orders: ordersToday } = useMedusa("orders", {
    search: {
      fields: "id",
      ["created_at[gt]"]: getToday().gt,
      ["created_at[lt]"]: getToday().lt,
    },
  })

  // useEffect(() => {
  //   navigate("/a/orders")
  // }, [])

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
        <Flex width="100%" justifyContent="space-evenly">
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
          <VerticalDivider />
          <SettingContainer p={4}>
            <SubTitle>
              <StyledImg src="https://img.icons8.com/ios/50/000000/currency-exchange.png" />
              Orders
            </SubTitle>
            <Text fontSize={14}>Today</Text>
          </SettingContainer>
        </Flex>
        <HorizontalDivider />
        <Flex width="100%" justifyContent="space-evenly">
          <SettingContainer pt={4}>
            <SubTitle mb={2}>
              <StyledImg src="https://img.icons8.com/ios/50/000000/merchant-account.png" />
              Requires action
            </SubTitle>
            <Text fontSize={15}>
              <b>20</b>{" "}
              <GoTo onClick={() => navigate("/a/orders")}>Order(s)</GoTo> are
              incomplete
            </Text>
            <Text fontSize={15}>
              <b>14</b>{" "}
              <GoTo onClick={() => navigate("/a/products")}>Product(s)</GoTo>{" "}
              are out of stock
            </Text>
          </SettingContainer>
          <VerticalDivider />
          <SettingContainer p={4}>
            <SubTitle>
              <StyledImg src="https://img.icons8.com/ios/50/000000/document-delivery.png" />
              Shipping
            </SubTitle>
            <Text fontSize={14}>Manage shipping profiles</Text>
            <StyledLinkText
              fontSize={14}
              color="link"
              sx={{ opacity: "0.5", pointerEvents: "none" }}
              onClick={() => navigate(`/a/settings/shipping-profiles`)}
            >
              Edit shipping profiles
            </StyledLinkText>
          </SettingContainer>
        </Flex>
        <HorizontalDivider />
        <Flex width="100%" justifyContent="space-evenly">
          <SettingContainer pt={4}>
            <SubTitle>
              <StyledImg src="https://img.icons8.com/ios/50/000000/purchase-order.png" />
              Orders
            </SubTitle>
            <Text fontSize={14}>Manage Order Settings</Text>
            <StyledLinkText
              fontSize={14}
              color="link"
              onClick={() => navigate(`/a/settings/return-reasons`)}
            >
              Manage Return Reasons
            </StyledLinkText>
          </SettingContainer>
          <VerticalDivider />
          <SettingContainer
            p={4}
            sx={{ opacity: "0.3", pointerEvents: "none" }}
          >
            <SubTitle>
              <StyledImg src="https://img.icons8.com/ios/50/000000/user-group-man-man.png" />
              Users
            </SubTitle>
            <Text fontSize={14}>Manage users of your Medusa store</Text>
          </SettingContainer>
        </Flex>
      </Flex>
    </>
  )
}

export default Overview
