import React, { useState, useContext } from "react"
import { navigate, Link } from "gatsby"
import { Router } from "@reach/router"
import { Flex, Box, Text, Image } from "rebass"
import { useForm } from "react-hook-form"
import qs from "qs"
import jwt from "jsonwebtoken"

import { AccountContext } from "../context/account"
import LoginLayout from "../components/login-layout"
import SEO from "../components/seo"
import InputField from "../components/input"
import Button from "../components/button"
import Spinner from "../components/spinner"
import Graphic from "../assets/login-graphic.png"
import Medusa from "../services/api"
import useMedusa from "../hooks/use-medusa"

const IndexPage = () => {
  const parsed = qs.parse(window.location.href.split("?")[1])

  let token = null
  if (parsed?.token) {
    try {
      token = jwt.decode(parsed.token)
    } catch (e) {
      token = null
    }
  }

  const { toaster } = useMedusa("collections")

  const [loading, setLoading] = useState(false)
  const account = useContext(AccountContext)
  const [email, setEmail] = useState(token?.email)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")

  const resetPassword = async event => {
    event.preventDefault()

    if (password !== repeatPassword) {
      toaster("Passwords should match", "error")
      return
    }

    await Medusa.users
      .resetPassword({ token: parsed?.token, password, email })
      .then(() => {
        navigate("/a")
        toaster(`Succesfully reset your password`, "success")
      })
      .catch(error => {
        console.log(error)
        toaster("Failed to reset your password", "error")
      })
  }

  return (
    <LoginLayout pt={3}>
      <SEO title="Login" />
      <Flex
        width="100%"
        height="100%"
        flexDirection="column"
        justifyContent="center"
      >
        <Flex
          alignItems="center"
          justifyContent="center"
          width="400px"
          sx={{
            position: "absolute",
            left: "50%",
            top: "40px",
            transform: "translate(-50%, 0)",
          }}
        >
          <Image src={Graphic} />
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
              <Text mb={4} fontWeight="bold" fontSize={4}>
                Reset your password
              </Text>
            ) : (
              <>
                <Text mb={4} fontWeight="bold" fontSize={4}>
                  Reset your password
                </Text>
                {loading ? (
                  <Flex justifyContent="center">
                    <Spinner dark width="20px" height="20px" />
                  </Flex>
                ) : (
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
                      onChange={e => setEmail(e.target.value)}
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
                    <Button
                      type="submit"
                      // onClick={() => acceptInvite()}
                      variant={"cta"}
                      mt={4}
                      width={1 / 4}
                    >
                      Login
                    </Button>
                  </Flex>
                )}
              </>
            )}
          </Box>
        </Flex>
      </Flex>
    </LoginLayout>
  )
}

export default IndexPage
