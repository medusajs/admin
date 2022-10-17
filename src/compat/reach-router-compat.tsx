import type { ReactNode } from "react"
import { Routes, Route } from "react-router-dom"

export { useLocation, useParams } from "react-router-dom"
export type { PathRouteProps as RouteComponentProps } from "react-router-dom"

type RouterProps = {
  children: ReactNode
}
export const Router = ({ children }: RouterProps) => {
  const routes = Array.isArray(children) ? children : [children]
  return (
    <Routes>
      {routes.map((route) => (
        <Route path={route.props.path} element={route} key={route.props.path} />
      ))}
    </Routes>
  )
}
