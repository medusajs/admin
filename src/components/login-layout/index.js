import { graphql, useStaticQuery } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import { Flex, Text } from "rebass"
import { Body, Container, Content, Main } from "./elements"

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
        <Content fontFamily={"body"}>
          <Body p={3} mx="auto">
            <Flex flexDirection="column" width={1} alignItems="center">
              {children}
              <Text fontSize={1} sx={{ "& a": { textDecoration: "none" } }}>
                © Medusa Commerce <span>&#183;</span>{" "}
                <a
                  style={{ color: "inherit", textDecoration: "none" }}
                  href="mailto:hello@medusa-commerce.com"
                >
                  Contact
                </a>
              </Text>
            </Flex>
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
