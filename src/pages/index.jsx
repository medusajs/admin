import { navigate } from "gatsby"
import React, { useEffect } from "react"
import SEO from "../components/seo"
import Layout from "../components/templates/layout"

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
