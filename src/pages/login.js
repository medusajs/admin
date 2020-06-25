import React from "react"
import { Router } from "@reach/router"
import { Flex, Box, Text } from "rebass"

import LoginLayout from "../components/login-layout"
import SEO from "../components/seo"
import InputField from "../components/input"
import Button from "../components/button"
import { ReactComponent as Logo } from "../assets/svg/logo.svg"
import { ReactComponent as LogoInline } from "../assets/svg/logo-horizontal.svg"

const IndexPage = () => (
  <LoginLayout>
    <SEO title="Login" />
    <Flex width={5 / 12} alignItems="center" justifyContent="center" p={4}>
      <LogoInline stroke="#53725D" height={15} />
    </Flex>
    <Box variant={"loginCard"} width={5 / 12} p={5}>
      <Text mb={4}>Sign in</Text>
      <InputField mb={3} label="Email" />
      <InputField type="password" label="Password" />
      <Button variant={"green"} mt={4} width={1}>
        Continue
      </Button>
    </Box>
  </LoginLayout>
)

export default IndexPage
