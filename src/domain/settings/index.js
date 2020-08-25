import React from "react"
import { Router } from "@reach/router"
import { Text, Flex, Box } from "rebass"

import Link from "../../components/link"
import Card from "../../components/card"

import Regions from "./regions"
import RegionDetails from "./regions/details"
import NewRegion from "./regions/new"
import Details from "./details"
import Currencies from "./currencies"
import Apps from "./apps"

// const SettingsIndex = () => {
//   return (
//     <Flex flexDirection={"column"}>
//       <Card>
//         <Card.Header>Business Settings</Card.Header>
//         <Card.Body>
//           <Box px={3}>
//             <Link to="/a/settings/details">Account details</Link>
//             <Link to="/a/settings/currencies">Currencies</Link>
//           </Box>
//           <Card.VerticalDivider mx={3} />
//           <Box px={3}>
//             <Link to="/a/settings/regions">Region Settings</Link>
//           </Box>
//           <Card.VerticalDivider mx={3} />
//         </Card.Body>
//       </Card>
//     </Flex>
//   )
// }

const SettingsIndex = () => {
  return (
    <Flex flexDirection={"column"}>
      <Card mb={2}>
        <Card.Header>Business Settings</Card.Header>
      </Card>
      <Details />
      <Currencies />
      <Regions />
    </Flex>
  )
}

const Settings = () => (
  <Router>
    <SettingsIndex path="/" />
    <Details path="details" />
    <Currencies path="currencies" />
    <Regions path="regions" />
    <Apps path="apps" />
    <NewRegion path="regions/new" />
    <RegionDetails path="regions/:id" />
  </Router>
)

export default Settings
