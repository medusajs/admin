import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"

import { Container, Main, Content, Body } from "./elements"

import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <Container>
      <Main>
        <Content fontFamily={"body"} p={4}>
          <Body p={3} mx="auto">
            {children}
          </Body>
        </Content>
      </Main>
    </Container>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
