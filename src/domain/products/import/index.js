import React, { useEffect, useState } from "react"
import _ from "lodash"
import { Text, Flex } from "rebass"
import useMedusa from "../../../hooks/use-medusa"

import Modal from "../../../components/modal"
import Button from "../../../components/button"
import CSVReader from "./reader"

const ImportProducts = ({ onClick }) => {
  const [json, setJson] = useState(null)
  const { store } = useMedusa("store")

  return (
    <Modal onClick={onClick}>
      <Modal.Body maxWidth="600px">
        <Modal.Header>
          <Text>Import products</Text>
        </Modal.Header>
        <Modal.Content flexDirection="column">
          {}
          <Text fontSize={1} mb={1}>
            Products in Medusa are uniquely identified by their handle.
            Therefore, when importing products, make sure to not have duplicate
            handles in your CSV file.
          </Text>
          <Text fontSize={1} mb={4}>
            Additionally, if some existing product has a handle from the CSV
            file, the product import will fail.
          </Text>
          {store?.currencies && (
            <CSVReader
              json={json}
              setJson={setJson}
              currencies={store.currencies.map(c => c.code)}
            />
          )}
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ImportProducts
