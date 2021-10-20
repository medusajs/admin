import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"

import Sidebar from "../sidebar"
import TopBar from "./topbar"

import { Container, Main, Content, Body } from "./elements"

import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
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
        <Sidebar />
        <Content fontFamily={"body"} pb={4} pl={4} pr={4}>
          <TopBar />
          <Body pl={3} pr={3} pb={3} mx="auto">
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
