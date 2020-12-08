import React from "react"
import { Router } from "@reach/router"
import { Flex } from "rebass"

import Card from "../../components/card"

import Regions from "./regions"
import ShippingProfiles from "./shipping-profiles"
import NewShippingProfile from "./shipping-profiles/new"
import ShippingProfileDetail from "./shipping-profiles/details"
import RegionDetails from "./regions/details"
import NewRegion from "./regions/new"
import Details from "./details"
import Currencies from "./currencies"
import Apps from "./apps"

const SettingsIndex = () => {
  return (
    <Flex flexDirection={"column"} mb={5}>
      {/* <Card mb={2}>
        <Card.Header>Business Settings</Card.Header>
      </Card> */}
      <Details />
      <Currencies />
      <Regions />
      <ShippingProfiles />
    </Flex>
  )
}

const Settings = () => (
  <Router>
    <SettingsIndex path="/" />
    <Details path="details" />
    <Currencies path="currencies" />
    <Regions path="regions" />
    <NewShippingProfile path="shipping-profiles/new" />
    <ShippingProfileDetail path="shipping-profiles/:id" />
    <Apps path="apps" />
    <NewRegion path="regions/new" />
    <RegionDetails path="regions/:id" />
  </Router>
)

export default Settings
