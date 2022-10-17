import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom"

import NotFound from "./pages/404"
import Dashboard from "./pages/a"
import IndexPage from "./pages/index"
import InvitePage from "./pages/invite"
import LoginPage from "./pages/login"
import ResetPasswordPage from "./pages/reset-password"

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<IndexPage />} />
      <Route path="a/*" element={<Dashboard />} />
      <Route path="invite" element={<InvitePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<NotFound />} />
    </>
  )
)

const App = () => <RouterProvider router={router} />

export default App
