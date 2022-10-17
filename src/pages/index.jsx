import React, { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SEO from "../components/seo"
import Layout from "../components/templates/layout"

const IndexPage = () => {
  const navigate = useNavigate()
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
