import React, { useEffect, useState } from "react"
import styled from "@emotion/styled"
import { Text, Flex, Box } from "rebass"

import Modal from "../../modal"
import Button from "../../button"
import Input from "../../molecules/input"

import useMedusa from "../../../hooks/use-medusa"
import Metadata from "../../organisms/metadata"

const MetadataEditor = React.forwardRef(
  ({ onKeyDown, value, onChange }, ref) => {
    const [show, setShow] = useState(false)
    const [metadata, setMetadata] = useState(
      Object.keys(value).map((key) => ({
        key,
        value: value[key],
      }))
    )

    useEffect(() => {
      if (typeof window !== "undefined") {
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
      }
    }, [])

    const handleScroll = (e) => {
      e.preventDefault()
    }

    const onSave = () => {
      onChange(
        metadata.reduce((acc, { key, value }) => {
          acc[key] = value
          return acc
        }, {})
      )
      setShow(false)
    }

    return (
      <>
        <Flex justifyContent="center">
          <Button
            ref={ref}
            variant="primary"
            onClick={() => setShow(!show)}
            height="24px"
            sx={{
              lineHeight: "20px",
              height: "24px !important",
            }}
          >
            Edit
          </Button>
        </Flex>
        {show && (
          <Modal onClick={() => setShow(!show)} onScroll={handleScroll}>
            <Modal.Body variant="card" onClick={(e) => e.stopPropagation()}>
              <Modal.Header>
                <Text fontSize={3}>Metadata</Text>
              </Modal.Header>
              <Modal.Content flexDirection="column">
                <Metadata
                  heading={false}
                  metadata={metadata}
                  setMetadata={setMetadata}
                />
              </Modal.Content>
              <Modal.Footer justifyContent="flex-end">
                <Button onClick={onSave} variant="primary">
                  Save
                </Button>
              </Modal.Footer>
            </Modal.Body>
          </Modal>
        )}
      </>
    )
  }
)

export default MetadataEditor
