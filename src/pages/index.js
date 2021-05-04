import React, { useEffect } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { navigate } from "gatsby"
import { Box, Flex, Text } from "rebass"
import styled from "@emotion/styled"

const IndexPage = () => {
  useEffect(() => {
    navigate("/a/home")
  }, [])

  return (
    <Layout>
      <SEO title="Home" />
    </Layout>
  )
}

export default IndexPage
