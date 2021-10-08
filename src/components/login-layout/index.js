import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import PropTypes from "prop-types"
import useWindowSize from "../../hooks/use-window-size"

import { Container, Main, Content, Body } from "./elements"

import { Flex, Box, Image, Text } from "rebass"

import "./layout.css"
import SEO from "../seo"
import Logo from "../../assets/svg/new-logo.svg"
import styled from "@emotion/styled"

const Layout = ({ title, children }) => {
  const { width, height } = useWindowSize()

  return (
    <Container>
      <Main>
        <Content fontFamily={"body"} p={4}>
          <Body p={3} mx="auto">
            <SEO title={title} />
            <Flex width="100%" height="100%" flexDirection="column">
              <Flex
                sx={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              ></Flex>
              <Flex
                sx={{
                  position: "absolute",
                  top: "40%",
                  left: "80%",
                }}
              ></Flex>
              <Flex
                sx={{
                  position: "absolute",
                  top: "20%",
                  left: "40%",
                }}
              ></Flex>
              <Flex
                sx={{
                  position: "absolute",
                  bottom: "20%",
                  left: "25%",
                }}
              ></Flex>
              <Flex alignItems="center" justifyContent="center" flexGrow={1}>
                <Image height="34px" src={Logo} />
              </Flex>
              <Flex
                backgroundColor="#fefefe"
                width={5 / 12}
                sx={{ zIndex: 9999 }}
                flexDirection="column"
                mx="auto"
                flexGrow={1}
                my={4}
              >
                <Flex
                  sx={{ flexDirection: "column" }}
                  variant={"loginCard"}
                  p={5}
                >
                  {children}
                </Flex>
              </Flex>
              <Flex alignItems="center" justifyContent="center">
                <Text fontSize={1}>© Medusa Commerce</Text>
              </Flex>
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
