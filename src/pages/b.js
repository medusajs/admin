import React from "react"
import PageDescription from "../components/atoms/page-description"
import Layout from "../components/organisms/layout"

const NewIndexPage = () => {
  return (
    <Layout>
      <PageDescription
        title={"Settings"}
        subtitle={"Manage the settings for your Medusa Store"}
      />
      <div>
        <p>Select Region</p>
      </div>
    </Layout>
  )
}

export default NewIndexPage
