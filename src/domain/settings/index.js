import React from "react"
import { Router } from "@reach/router"
import { Box, Flex, Text } from "rebass"
import { Link, navigate } from "gatsby"

import Regions from "./regions"
import ReturnReasons from "./return-reasons"
import NewReturnReason from "./return-reasons/new"
import EditReturnReason from "./return-reasons/edit"
import ShippingProfiles from "./shipping-profiles"
import NewShippingProfile from "./shipping-profiles/new"
import ShippingProfileDetail from "./shipping-profiles/details"
import RegionDetails from "./regions/details"
import NewRegion from "./regions/new"
import Details from "./details"
import Currencies from "./currencies"
import Apps from "./apps"
import styled from "@emotion/styled"

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
  font-size: 15px;
  font-weight: 500;
  display: flex;

  align-items: center;
`

const SettingContainer = styled(Flex)`
  width: 50%;
  min-height: 120px;
  flex-direction: column;
`

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

const SettingsIndex = () => {
  return (
    <Flex flexDirection={"column"} pb={5} pt={5}>
      <Flex flexDirection="column">
        <Text mb={1} fontSize={20} fontWeight="bold">
          Settings
        </Text>
        <Text mb={3} fontSize={14}>
          Manage the settings for your Medusa store
        </Text>
      </Flex>
      <HorizontalDivider />
      <Flex width="100%" justifyContent="space-evenly">
        <SettingContainer py={4}>
          <SubTitle>
            <StyledImg src="https://img.icons8.com/ios/50/000000/region-code.png" />
            Regions
          </SubTitle>
          <Text fontSize={14}>
            Manage the markets that you will operate within
          </Text>
          <StyledLinkText
            fontSize={14}
            color="link"
            onClick={() => navigate(`/a/settings/regions`)}
          >
            Region settings
          </StyledLinkText>
        </SettingContainer>
        <VerticalDivider />
        <SettingContainer p={4}>
          <SubTitle>
            <StyledImg src="https://img.icons8.com/ios/50/000000/currency-exchange.png" />
            Currencies
          </SubTitle>
          <Text fontSize={14}>
            Manage the market that you will operate within
          </Text>
          <StyledLinkText
            fontSize={14}
            color="link"
            onClick={() => navigate(`/a/settings/currencies`)}
          >
            Currency settings
          </StyledLinkText>
        </SettingContainer>
      </Flex>
      <HorizontalDivider />
      <Flex width="100%" justifyContent="space-evenly">
        <SettingContainer pt={4}>
          <SubTitle>
            <StyledImg src="https://img.icons8.com/ios/50/000000/merchant-account.png" />
            Account details
          </SubTitle>
          <Text fontSize={14}>Manage your business details</Text>
          <StyledLinkText
            fontSize={14}
            color="link"
            onClick={() => navigate(`/a/settings/details`)}
          >
            Details
          </StyledLinkText>
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
        <SettingContainer p={4} sx={{ opacity: "0.3", pointerEvents: "none" }}>
          <SubTitle>
            <StyledImg src="https://img.icons8.com/ios/50/000000/user-group-man-man.png" />
            Users
          </SubTitle>
          <Text fontSize={14}>Manage users of your Medusa store</Text>
        </SettingContainer>
      </Flex>
    </Flex>
  )
}

const Settings = () => (
  <Router>
    <SettingsIndex path="/" />
    <Apps path="apps" />

    <Details path="details" />

    <Currencies path="currencies" />

    <ReturnReasons path="return-reasons" />
    <EditReturnReason path="return-reasons/:id" />
    <NewReturnReason path="return-reasons/new" />

    <NewShippingProfile path="shipping-profiles/new" />
    <ShippingProfileDetail path="shipping-profiles/:id" />

    <Regions path="regions" />
    <RegionDetails path="regions/:id" />
    <NewRegion path="regions/new" />
  </Router>
)

export default Settings
