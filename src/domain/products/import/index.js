import React, { useEffect, useState } from "react"
import _ from "lodash"
import { Text, Flex } from "rebass"
import useMedusa from "../../../hooks/use-medusa"

import Modal from "../../../components/modal"
import Button from "../../../components/button"
import CSVReader from "./reader"

const ImportProducts = ({ onClick }) => {
  const [json, setJson] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const { store } = useMedusa("store")

  return (
    <Modal onClick={onClick}>
      <Modal.Body maxWidth="">
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
                Products in Medusa are uniquely identified by their handle.
                Therefore, when importing products, products will be grouped by
                their handle.
              </Text>
              <Text fontSize={1} mb={4}>
                Additionally, if some existing product has a handle from the CSV
                file, the product import will fail.
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
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end" alignItems="center">
          <Text fontSize="14px" onClick={onClick} sx={{ cursor: "pointer" }}>
            Cancel
          </Text>
          <Button type="submit" variant="primary" ml={4}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ImportProducts
