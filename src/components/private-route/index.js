import React, { useState, useContext } from "react"
import { navigate } from "gatsby"

import { AccountContext } from "../../context/account"

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const [loading, setLoading] = useState(false)
  const account = useContext(AccountContext)

  if (account.isLoggedIn) {
    return <Component {...rest} />
  } else if (!loading) {
    account
      .session()
      .then(data => {
        setLoading(false)
      })
      .catch(err => {
        navigate("/login")
      })
  }
  return "Loading..."
}

export default PrivateRoute
