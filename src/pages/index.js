import React, { useEffect } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import { navigate } from "gatsby"

const IndexPage = () => {
  useEffect(() => {
    navigate("/a/orders")
  }, [])

  return (
    <Layout>
      <SEO title="Home" />
      <div>hi index</div>
    </Layout>
  )
}

export default IndexPage
