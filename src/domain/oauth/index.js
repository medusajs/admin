import qs from "query-string"
import React from "react"
import { Box } from "rebass"
import Button from "../../components/button"
import Medusa from "../../services/api"

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
