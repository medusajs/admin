import { navigate } from "gatsby"
import React, { useContext, useState } from "react"
import { AccountContext } from "../../context/account"
import Spinner from "../atoms/spinner"

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const account = useContext(AccountContext)
  const [loading, setLoading] = useState(true)

  React.useEffect(() => {
    account
      .session()
      .then((data) => {
        setLoading(false)
      })
      .catch((err) => {
        navigate("/login")
      })
  }, [])

  if (account.isLoggedIn && !loading) {
    return <Component {...rest} />
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Spinner variant="secondary" />
    </div>
  )
}

export default PrivateRoute
