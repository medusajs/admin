import React, { useState, useContext } from "react"
import { navigate } from "gatsby"
import { Flex, Box, Text, Image } from "rebass"
import { useForm } from "react-hook-form"

import { AccountContext } from "../context/account"
import LoginLayout from "../components/login-layout"
import SEO from "../components/seo"
import InputField from "../components/input"
import Button from "../components/button"
import Spinner from "../components/spinner"
import { ReactComponent as Graphic } from "../assets/login-graphic.svg"
import Medusa from "../services/api"

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const account = useContext(AccountContext)
  const { handleSubmit } = useForm()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [resetPassword, setResetPassword] = useState(false)
  const [passwordtokenGenerated, setPasswordtokenGenerated] = useState(false)

  const handleLogin = data => {
    setLoading(true)
    if (resetPassword) {
      Medusa.users.resetPasswordToken({ email }).then(data => {
        setEmail("")
        setPassword("")
        setPasswordtokenGenerated(true)
      })
    } else {
      account.handleLogin({ email, password }).then(() => {
        navigate("/a")
      })
    }
    setLoading(false)
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
          sx={{ position: "absolute", top: "120px", width: "100%" }}
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
          onSubmit={handleSubmit(handleLogin)}
        >
          <Box width={1} variant={"loginCard"} p={4} justifyContent="center">
            {resetPassword ? (
              <>
                <Text mb={2} fontWeight="bold" fontSize={4}>
                  Reset Password
                </Text>
                <Flex width={1} flexDirection="column" alignItems="center">
                  <Flex width={1} justifyContent="flex-start">
                    <Text
                      onClick={() => setResetPassword(false)}
                      fontSize={2}
                      mb={2}
                      color="blue"
                    >
                      Back
                    </Text>
                  </Flex>
                  <Text>
                    {passwordtokenGenerated
                      ? "A reset link has been sent to your email"
                      : ""}
                  </Text>
                  <InputField
                    my={3}
                    width="100%"
                    label="Email"
                    name="email"
                    value={email}
                    placeholder="lebron@james.com"
                    onChange={e => setEmail(e.target.value)}
                    boldLabel={true}
                  />
                  <Button type="submit" variant={"cta"} mt={3} width={1 / 4}>
                    Submit
                  </Button>
                </Flex>
              </>
            ) : (
              <>
                <Text mb={4} fontWeight="bold" fontSize={4}>
                  Sign in
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
                      placeholder="lebron@james.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      boldLabel={true}
                    />
                    <InputField
                      mb={3}
                      type="password"
                      width="100%"
                      placeholder="********"
                      label="Password"
                      boldLabel={true}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <Button
                      type="submit"
                      variant={"cta"}
                      mt={4}
                      sx={{ fontWeight: 700 }}
                      width={1 / 4}
                    >
                      Login
                    </Button>
                  </Flex>
                )}
              </>
            )}
          </Box>
          {!resetPassword && (
            <Text
              onClick={() => setResetPassword(true)}
              pt={2}
              sx={{
                fontSize: 1,
                color: "gray",
                cursor: "pointer",
                transition: "0.4s",
                "&:hover": {
                  // color: "black",
                  filter: "brightness(0.60)",
                },
              }}
            >
              Forgot your password? Click here
            </Text>
          )}
        </Flex>
      </Flex>
    </LoginLayout>
  )
}

export default LoginPage
