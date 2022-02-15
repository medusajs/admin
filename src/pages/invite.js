import React, { useState } from "react"
import { navigate } from "gatsby"
import { Flex, Box, Text, Image } from "rebass"
import qs from "qs"
import jwt from "jsonwebtoken"

import LoginLayout from "../components/login-layout"
import SEO from "../components/seo"
import InputField from "../components/molecules/input"
import Button from "../components/fundamentals/button"
import Medusa from "../services/api"
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
      <div className="flex w-full h-full justify-center items-center">
        <div className="flex bg-grey-0 min-h-[600px] rounded-rounded">
          <form onSubmit={acceptInvite}>
            <div className="p-12 flex flex-col items-center">
              <div className="w-full flex justify-center mb-8">
                <MedusaIcon />
              </div>
              {!token ? (
                <div className="flex flex-col items-center">
                  <span className="inter-xlarge-semibold mb-4 text-grey-90">
                    You signup link is invalid
                  </span>
                  <span className="inter-large-regular mb-4 text-grey-90">
                    Contact your administrator to obtain a valid signup link
                  </span>
                </div>
              ) : (
                <>
                  <span className="inter-xlarge-semibold mb-4 text-grey-90">
                    You have been invited to join the Team!
                  </span>
                  <div className="grid w-full gap-y-small">
                    <InputField
                      mb={3}
                      width="100%"
                      label="Email"
                      name="email"
                      required
                      value={email}
                      inputStyle={{
                        color: "#454545",
                        backgroundColor: "#f0f0f0",
                      }}
                      disabled={true}
                      onChange={(e) => setEmail(e.target.value)}
                      boldLabel={true}
                    />
                    <div className="grid grid-cols-2 gap-x-small">
                      <InputField
                        mb={3}
                        mr={3}
                        width="50%"
                        placeholder="First name..."
                        label="First name"
                        boldLabel={true}
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <InputField
                        mb={3}
                        width="50%"
                        placeholder="Last name..."
                        label="Last name"
                        boldLabel={true}
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    <InputField
                      mb={3}
                      type="password"
                      width="100%"
                      required
                      placeholder="Password..."
                      label="Password"
                      boldLabel={true}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputField
                      mb={3}
                      type="password"
                      width="100%"
                      required
                      placeholder="Repeat password..."
                      label="Repeat password"
                      boldLabel={true}
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    className="rounded-rounded mt-8 w-full inter-base-regular"
                  >
                    Login
                  </Button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </LoginLayout>
  )
}

export default InvitePage
