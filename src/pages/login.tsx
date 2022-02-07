import { navigate } from "gatsby"
import { useAdminLogin } from "medusa-react"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import Button from "../components/fundamentals/button"
import MedusaIcon from "../components/fundamentals/icons/medusa-icon"
import LoginLayout from "../components/login-layout"
import SigninInput from "../components/molecules/input-signin"
import SEO from "../components/seo"

const LoginPage = () => {
  const login = useAdminLogin()
  const { handleSubmit, register } = useForm()
  const [resetPassword, setResetPassword] = useState(false)
  const [isInvalidLogin, setIsInvalidLogin] = useState(false)

  const handleLogin = (data) => {
    if (resetPassword) {
      // TODO: To be implemented
    } else {
      login.mutate(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            navigate("/a/orders")
          },
          onError: (err) => {
            setIsInvalidLogin(true)
          },
        }
      )
    }
  }

  return (
    <LoginLayout>
      <SEO title="Login" />
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex min-h-[600px] bg-grey-0 rounded-rounded justify-center">
          <form
            className="flex flex-col pt-12 w-full px-[120px] items-center"
            onSubmit={handleSubmit(handleLogin)}
          >
            <MedusaIcon />
            {resetPassword ? (
              <>
                <span className="inter-2xlarge-semibold mt-4 text-grey-90">
                  Reset password
                </span>
                <span className="inter-base-regular text-grey-50">
                  Enter email below to get a password reset token
                </span>
                <SigninInput placeholder="Email..." />
                <button className="text-grey-0 w-[320px] h-[48px] border rounded-rounded mt-4 bg-violet-50 inter-base-regular py-3 px-4">
                  Reset
                </button>
                <span
                  className="inter-small-regular text-grey-50 mt-8 cursor-pointer"
                  onClick={() => setResetPassword(false)}
                >
                  Back to sign in
                </span>
              </>
            ) : (
              <>
                <span className="inter-2xlarge-semibold mt-4 text-grey-90">
                  Welcome back!
                </span>
                <span className="inter-base-regular text-grey-50 mt-2">
                  It's great to see you 👋🏼
                </span>
                <span className="inter-base-regular text-grey-50">
                  Log in to your account below
                </span>
                <SigninInput
                  placeholder="Email..."
                  name="email"
                  ref={register({ required: true })}
                />
                <SigninInput
                  placeholder="Password..."
                  type={"password"}
                  name="password"
                  ref={register({ required: true })}
                />
                {isInvalidLogin && (
                  <span className="text-rose-50 w-full mt-2 inter-small-regular">
                    These credentials do not match our records
                  </span>
                )}
                <Button
                  className="rounded-rounded mt-4 w-[320px] inter-base-regular"
                  variant="primary"
                  size="large"
                  type="submit"
                  loading={login.isLoading}
                >
                  Continue
                </Button>
                <span
                  className="inter-small-regular text-grey-50 mt-8 cursor-pointer"
                  onClick={() => setResetPassword(true)}
                >
                  Reset password
                </span>
              </>
            )}
          </form>
        </div>
      </div>
    </LoginLayout>
  )
}

export default LoginPage
