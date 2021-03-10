import React, { useState } from "react"
import styled from "@emotion/styled"
import _ from "lodash"
import { Flex, Box, Image, Text } from "rebass"

import Medusa from "../../../../services/api"

import Card from "../../../../components/card"
import Spinner from "../../../../components/spinner"

const StyledImageCard = styled(Image)`
  height: 200px;
  width: 200px;

  border: ${props => (props.selected ? "1px solid #53725D" : "none")};

  cursor: pointer;

  object-fit: contain;

  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.08) 0px 3px 9px 0px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;

  border-radius: 3px;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
      rgba(60, 66, 87, 0.16) 0px 0px 0px 1px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.2) 0px 5px 9px 0px;
  }
`

const Options = ({ product }) => {
  const [selectedImages, setSelectedImages] = useState([])

  return (
    <Card mb={2}>
      <Card.Header
        action={
          selectedImages.length > 0 && {
            type: "delete",
            label: "Delete images",
            onClick: () => {
              handleImageDelete()
            },
          }
        }
      >
        Options
      </Card.Header>
      <Card.Body px={3}>
        <Flex flexDirection="column" width="100%">
          <Flex justifyContent="" fontWeight="500">
            <Text>Title</Text>
          </Flex>
          {product?.options.map(po => (
            <Flex justifyContent="">
              <Text>{po.title}</Text>
            </Flex>
          ))}
        </Flex>
      </Card.Body>
    </Card>
  )
}

export default Options
