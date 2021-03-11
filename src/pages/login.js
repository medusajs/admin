import React, { useState, useContext } from "react"
import { navigate } from "gatsby"
import { Router } from "@reach/router"
import { Flex, Box, Text, Image } from "rebass"
import { useForm } from "react-hook-form"

import { AccountContext } from "../context/account"
import LoginLayout from "../components/login-layout"
import SEO from "../components/seo"
import InputField from "../components/input"
import Button from "../components/button"
import Spinner from "../components/spinner"
import Graphic from "../assets/login-graphic.png"

import MedusaClient from "../services/api"

const IndexPage = () => {
  const [loading, setLoading] = useState(false)
  const account = useContext(AccountContext)
  const { register, handleSubmit } = useForm()

  const handleLogin = data => {
    setLoading(true)
    account
      .handleLogin(data)
      .then(() => {
        navigate("/a")
      })
      .finally(() => {
        setLoading(false)
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
          mx="auto"
          as="form"
          height="400px"
          onSubmit={handleSubmit(handleLogin)}
        >
          <Box variant={"loginCard"} p={5} height="100%">
            <Text mb={4} fontWeight="bold" fontSize={4}>
              Sign in to your account
            </Text>
            {loading ? (
              <Flex justifyContent="center">
                <Spinner dark width="20px" height="20px" />
              </Flex>
            ) : (
              <>
                <InputField
                  mb={3}
                  label="Email"
                  name="email"
                  ref={register}
                  boldLabel={true}
                />
                <InputField
                  type="password"
                  label="Password"
                  boldLabel={true}
                  name="password"
                  ref={register}
                />
                <Button type="submit" variant={"cta"} mt={4} width={1}>
                  Continue
                </Button>
              </>
            )}
          </Box>
        </Flex>
      </Flex>
    </LoginLayout>
  )
}

export default IndexPage
