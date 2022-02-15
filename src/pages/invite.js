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
import useMedusa from "../hooks/use-medusa"
import MedusaIcon from "../components/fundamentals/icons/medusa-icon"

const InvitePage = ({ location }) => {
  const parsed = qs.parse(location.search.substring(1))

  let token = null
  if (parsed?.token) {
    try {
      token = jwt.decode(parsed.token)
    } catch (e) {
      token = null
    }
  }

  const [email, setEmail] = useState(
    token?.user_email || "test@medusa-test.com"
  )
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")

  const acceptInvite = async (event) => {
    event.preventDefault()

    if (password === repeatPassword) {
      await Medusa.invites
        .accept({
          token: parsed?.token,
          user: { first_name: firstName, last_name: lastName, password },
        })
        .then(() => {
          navigate("/login")
        })
        .catch((error) => {})
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
          backgroundColor="#fefefe"
          width={5 / 12}
          sx={{ zIndex: 9999 }}
          flexDirection="column"
          alignItems="center"
          mx="auto"
          as="form"
          height="400px"
          onSubmit={acceptInvite}
        >
          <Box width={1} p={4} justifyContent="center">
            <div className="w-full flex justify-center mb-8">
              <MedusaIcon />
            </div>
            {!token ? (
              <Flex flexDirection="column" alignItems="center">
                <Text mb={2} fontWeight="bold" fontSize={4}>
                  You signup link is invalid
                </Text>
                <Text mb={2} fontSize={2}>
                  Contact your administrator to obtain a valid signup link
                </Text>
              </Flex>
            ) : (
              <>
                <Text mb={4} fontWeight="bold" fontSize={4}>
                  You have been invited to join the Team!
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
                    onChange={(e) => setEmail(e.target.value)}
                    boldLabel={true}
                  />
                  <Flex width={1} justifyContent="space-between">
                    <InputField
                      mb={3}
                      mr={3}
                      width="50%"
                      label="First name"
                      boldLabel={true}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <InputField
                      mb={3}
                      width="50%"
                      label="Last name"
                      boldLabel={true}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Flex>
                  <InputField
                    mb={3}
                    type="password"
                    width="100%"
                    label="Password"
                    boldLabel={true}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputField
                    mb={3}
                    type="password"
                    width="100%"
                    label="Repeat password"
                    boldLabel={true}
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
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

export default InvitePage
