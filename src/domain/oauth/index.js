import React from "react"
import { navigate } from "gatsby"
import { Router } from "@reach/router"
import { Text, Box, Flex } from "rebass"
import styled from "@emotion/styled"
import qs from "query-string"

import Medusa from "../../services/api"
import useMedusa from "../../hooks/use-medusa"
import Spinner from "../../components/spinner"
import Button from "../../components/button"

const Oauth = ({ app_name }) => {
  const { code, state } = qs.parse(location.search)
  return (
    <>
      <Box>{app_name}</Box>
      <Button
        onClick={() =>
          Medusa.apps.authorize({
            application_name: app_name,
            code,
            state,
          })
        }
      >
        Complete Installation
      </Button>
    </>
  )
}

export default Oauth
