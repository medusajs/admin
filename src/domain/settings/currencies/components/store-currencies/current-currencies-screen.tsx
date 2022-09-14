import { AdminGetCurrenciesParams } from "@medusajs/medusa"
import React, { useContext, useState } from "react"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../../components/molecules/modal/layered-modal"
import { useEditCurrenciesModal } from "./edit-currencies-modal"
import CurrenciesTable from "./table"

const CurrentCurrenciesScreen = () => {
  const [params, setParams] = useState<AdminGetCurrenciesParams | undefined>(
    undefined
  )
  const { push } = useContext(LayeredModalContext)
  const { onClose, store } = useEditCurrenciesModal()

  return (
    <>
      <Modal.Header handleClose={onClose}>
        <h1 className="inter-xlarge-semibold">Current Store Currencies</h1>
      </Modal.Header>
      <Modal.Content>
        <CurrenciesTable
          source={store.currencies}
          count={store.currencies.length}
          params={params}
          setParams={setParams}
        />
      </Modal.Content>
      <Modal.Footer>
        <div className="w-full justify-end flex items-center">
          <Button variant="primary" size="small">
            Close
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export default CurrentCurrenciesScreen
