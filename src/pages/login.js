import React, { useState, useContext } from "react"
import { navigate } from "gatsby"
import { Router } from "@reach/router"
import { Flex, Box, Text } from "rebass"
import { useForm } from "react-hook-form"

import { AccountContext } from "../context/account"
import LoginLayout from "../components/login-layout"
import SEO from "../components/seo"
import InputField from "../components/input"
import Button from "../components/button"
import Spinner from "../components/spinner"
import { ReactComponent as Logo } from "../assets/svg/logo.svg"
import { ReactComponent as LogoInline } from "../assets/svg/logo-horizontal.svg"

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
    <LoginLayout>
      <SEO title="Login" />
      <Flex
        width={5 / 12}
        flexDirection="column"
        mx="auto"
        as="form"
        onSubmit={handleSubmit(handleLogin)}
      >
        <Flex alignItems="center" justifyContent="center" p={4}>
          <LogoInline stroke="#53725D" height={15} />
        </Flex>
        <Box variant={"loginCard"} p={5}>
          <Text mb={4}>Sign in</Text>
          {loading ? (
            <Flex justifyContent="center">
              <Spinner dark width="20px" height="20px" />
            </Flex>
          ) : (
            <>
              <InputField mb={3} label="Email" name="email" ref={register} />
              <InputField
                type="password"
                label="Password"
                name="password"
                ref={register}
              />
              <Button type="submit" variant={"green"} mt={4} width={1}>
                Continue
              </Button>
            </>
          )}
        </Box>
      </Flex>
    </LoginLayout>
  )
}

export default IndexPage
