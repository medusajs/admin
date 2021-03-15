import React, { useEffect, useState } from "react"
import _ from "lodash"
import { Text, Flex } from "rebass"
import useMedusa from "../../../hooks/use-medusa"
import Medusa from "../../../services/api"

import Modal from "../../../components/modal"
import Button from "../../../components/button"
import CSVReader from "./reader"
import Spinner from "../../../components/spinner"

const ImportProducts = ({ dismiss, handleSubmit, importing }) => {
  const [json, setJson] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const { store } = useMedusa("store")

  return (
    <Modal onClick={dismiss}>
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
          {store?.currencies || false ? (
            <CSVReader
              json={json}
              setJson={setJson}
              currencies={store.currencies.map(c => c.code)}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          ) : (
            <Flex width="100%" justifyContent="center" mt={3}>
              <Flex height="50px" width="50px">
                <Spinner dark={true} />
              </Flex>
            </Flex>
          )}
          <Text fontSize={1} mt={4}>
            Products will be updated, if matching handle is identified.
          </Text>
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end" alignItems="center">
          <Text fontSize="14px" onClick={dismiss} sx={{ cursor: "pointer" }}>
            Cancel
          </Text>
          <Button
            type="submit"
            variant="primary"
            ml={4}
            loading={importing}
            onClick={() => handleSubmit(json)}
          >
            Upload
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ImportProducts
