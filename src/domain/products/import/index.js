import React, { useEffect, useState } from "react"
import _ from "lodash"
import { Text, Flex } from "rebass"
import useMedusa from "../../../hooks/use-medusa"
import Medusa from "../../../services/api"

import Modal from "../../../components/modal"
import Button from "../../../components/button"
import CSVReader from "./reader"

const ImportProducts = ({ onClick }) => {
  const [json, setJson] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const { store } = useMedusa("store")

  const handleSubmit = async () => {
    try {
      await Medusa.products.importProducts(json)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal onClick={onClick}>
      <Modal.Body minWidth={json ? "800px !important" : "650px !important"}>
        <Modal.Header>
          <Text>Import products</Text>
        </Modal.Header>
        <Modal.Content flexDirection="column">
          {errorMessage ? (
            <Text fontSize={1} mb={1} color="danger" fontStyle="italic">
              {errorMessage}
            </Text>
          ) : (
            <>
              <Text fontSize={1} mb={1}>
                Download a CSV template to see the product format required for
                the import.
              </Text>
            </>
          )}
          {store?.currencies && (
            <CSVReader
              json={json}
              setJson={setJson}
              currencies={store.currencies.map(c => c.code)}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          )}
          <Text fontSize={1} mt={4}>
            Existing products will be updated based on their handle.
          </Text>
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end" alignItems="center">
          <Text fontSize="14px" onClick={onClick} sx={{ cursor: "pointer" }}>
            Cancel
          </Text>
          <Button
            type="submit"
            variant="primary"
            ml={4}
            onClick={() => handleSubmit()}
          >
            Upload
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ImportProducts
