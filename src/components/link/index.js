import React from "react"
import { Box, Link as RebassLink } from "rebass"
import { Link as GatsbyLink } from "gatsby"
// Since DOM elements <a> cannot receive activeClassName
// and partiallyActive, destructure the prop here and
// pass it only to GatsbyLink
const Link = ({
  children,
  to,
  className,
  activeClassName,
  partiallyActive,
  ...other
}) => {
  if (!to) {
    return (
      <Box className={className} {...other}>
        {children}
      </Box>
    )
  }

  // Tailor the following test to your environment.
  // This example assumes that any internal link (intended for Gatsby)
  // will start with exactly one slash, and that anything else is external.
  const internal = /^\/(?!\/)/.test(to)
  // Use Gatsby Link for internal links, and <a> for others
  if (internal) {
    return (
      <GatsbyLink
        className={className}
        to={to}
        activeClassName={activeClassName}
        partiallyActive={partiallyActive}
      >
        <Box {...other}>{children}</Box>
      </GatsbyLink>
    )
  }
  return (
    <RebassLink href={to} className={className} {...other}>
      {children}
    </RebassLink>
  )
}
export default Link
