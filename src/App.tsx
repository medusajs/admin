import type { FC } from "react"
import { Router } from "@reach/router"
import type { RouteComponentProps } from "@reach/router"

import NotFound from "./pages/404"
import Dashboard from "./pages/a"
import IndexPage from "./pages/index"
import InvitePage from "./pages/invite"
import LoginPage from "./pages/login"
import ResetPasswordPage from "./pages/reset-password"

type RouteProps = {
  component: FC<{ location: unknown }>
} & RouteComponentProps

const Route = ({ component: Component, location }: RouteProps) => (
  <Component location={location} />
)

const App = () => {
  return (
    <Router className="h-full">
      <Route path="/" component={IndexPage} />
      <Route path="a" component={Dashboard} />
      <Route path="a/*" component={Dashboard} />
      <Route path="invite" component={InvitePage} />
      <Route path="login" component={LoginPage} />
      <Route path="reset-password" component={ResetPasswordPage} />
      <Route default component={NotFound} />
    </Router>
  )
}

export default App
