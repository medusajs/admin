import type { HTMLAttributes, ReactNode } from "react"
import { Link as RouterLink, useMatch } from "react-router-dom"

export function navigate(path: string | number) {
  if (typeof path === "number") {
    return history.go(path)
  }
  if (window.location.pathname !== path) {
    history.pushState(path, path)
    if (window.location.pathname !== path) {
      window.location.pathname = path
    }
  }
}

type HTMLAnchorAttributes = HTMLAttributes<HTMLAnchorElement>

export type LinkProps = {
  to: string | null
  activeClassName?: HTMLAnchorAttributes["className"]
  partiallyActive?: boolean
  children?: ReactNode
} & Omit<HTMLAnchorAttributes, "href">

export function Link(props: LinkProps) {
  const {
    to,
    children,
    className,
    activeClassName = "",
    partiallyActive,
    ...attr
  } = props

  const isActive = useMatch(to ?? "")
  const isPartiallyActive = useMatch({ path: to ?? "", end: false })

  let cls = className ?? ""
  if (activeClassName && (isActive || (partiallyActive && isPartiallyActive))) {
    cls += " " + activeClassName
  }

  const hidden = typeof to !== "string"

  return (
    <RouterLink to={to ?? ""} hidden={hidden} {...attr} className={cls}>
      {children}
    </RouterLink>
  )
}

export const graphql = () => ""
export const useStaticQuery = () => ({
  site: {
    siteMetadata: {
      title: `Admin`,
      description: `The best ecommerce software.`,
      author: `@medusajs`,
    },
  },
})
