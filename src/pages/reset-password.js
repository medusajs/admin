import React, { useState } from "react"
import { navigate } from "gatsby"
import { Flex, Box, Text, Image } from "rebass"
import qs from "qs"
import jwt from "jsonwebtoken"

import LoginLayout from "../components/login-layout"
import SEO from "../components/seo"
import InputField from "../components/molecules/input"
import Button from "../components/button"
import { ReactComponent as Graphic } from "../assets/login-graphic.svg"

import Medusa from "../services/api"

const ResetPasswordPage = ({ location }) => {
  const parsed = qs.parse(location.search.substring(1))
  let token = null
  if (parsed?.token) {
    try {
      token = jwt.decode(parsed.token)
    } catch (e) {
      token = null
    }
  }

  const [email, _] = useState(token?.email || parsed?.email)
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")

  const resetPassword = async event => {
    event.preventDefault()

    if (password === repeatPassword) {
      await Medusa.users
        .resetPassword({ token: parsed?.token, password, email })
        .then(() => {
          navigate("/login")
        })
        .catch(error => {})
    }
  }

  return (
    <LoginLayout pt={3}>
      <SEO title="Login" />
      <Flex
        width="100%"
        height="100%"
        flexDirection="column"
        justifyContent="center"
        sx={{ position: "relative" }}
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          sx={{ position: "absolute", top: "80px", width: "100%" }}
        >
          <Graphic />
        </Flex>
        <Flex
          backgroundColor="#fefefe"
          width={5 / 12}
          sx={{ zIndex: 9999 }}
          flexDirection="column"
          alignItems="center"
          mx="auto"
          as="form"
          height="400px"
          onSubmit={resetPassword}
        >
          <Box width={1} variant={"loginCard"} p={4} justifyContent="center">
            {!token ? (
              <>
                <Text mb={4} fontWeight="bold" fontSize={4}>
                  Your reset link is invalid
                </Text>
                <Text mb={2} fontSize={2}>
                  Please try resetting your password again
                </Text>
              </>
            ) : (
              <>
                <Text mb={4} fontWeight="bold" fontSize={4}>
                  Reset your password
                </Text>
                <Flex width={1} flexDirection="column" alignItems="center">
                  <InputField
                    mb={3}
                    width="100%"
                    label="Email"
                    name="email"
                    value={email}
                    inputStyle={{
                      color: "#454545",
                      backgroundColor: "#f0f0f0",
                    }}
                    disabled={true}
                    boldLabel={true}
                  />
                  <InputField
                    mb={3}
                    type="password"
                    width="100%"
                    label="New password"
                    boldLabel={true}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <InputField
                    mb={3}
                    type="password"
                    width="100%"
                    label="Repeat password"
                    boldLabel={true}
                    value={repeatPassword}
                    onChange={e => setRepeatPassword(e.target.value)}
                  />
                  <Button type="submit" variant={"cta"} mt={4} width={1 / 4}>
                    Login
                  </Button>
                </Flex>
              </>
            )}
          </Box>
        </Flex>
      </Flex>
    </LoginLayout>
  )
}

export default ResetPasswordPage
