import styled from "@emotion/styled"
import React from "react"
import CopyToClipboardComponent from "./index"

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 300px;
`

export const Default = () => {
  return (
    <Container>
      <CopyToClipboardComponent
        tooltipText="https://some_crazy_link/489729"
        label="Click here to copy!"
        copyText="medusa >>> shopify"
        successDuration={3000}
        onCopy={() => {}}
      />
    </Container>
  )
}

export default {
  title: "Copy To Clipboard",
}
