import React, { createContext, PropsWithChildren, useState } from "react"

import { CustomerGroup } from "@medusajs/medusa"
import { useAdminUpdateCustomerGroup } from "medusa-react"

import CustomerGroupModal from "../customer-group-modal"
import { getErrorMessage } from "../../../../utils/error-messages"
import useNotification from "../../../../hooks/use-notification"

type CustomerGroupContextT = {
  group?: CustomerGroup
  showModal: () => void
  hideModal: () => void
}

const CustomerGroupContext = createContext<CustomerGroupContextT>()

type CustomerGroupContextContainer = PropsWithChildren<{
  group?: CustomerGroup
}>

export function CustomerGroupContextContainer(
  props: CustomerGroupContextContainer
) {
  const notification = useNotification()
  const { mutate: updateGroup } = useAdminUpdateCustomerGroup(props.group?.id)

  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => setIsModalVisible(true)
  const hideModal = () => setIsModalVisible(false)

  const handleEdit = (data) => {
    updateGroup(data, {
      onSuccess: () => {
        notification(
          "Success",
          "Successfully updated the customer group",
          "success"
        )
        hideModal()
      },
      onError: (err) => notification("Error", getErrorMessage(err), "error"),
    })
  }

  const context = {
    group: props.group,
    isModalVisible,
    showModal,
    hideModal,
  }

  return (
    <CustomerGroupContext.Provider value={context}>
      {props.children}

      {isModalVisible && (
        <CustomerGroupModal
          handleClose={hideModal}
          handleSave={handleEdit}
          initialData={props.group}
        />
      )}
    </CustomerGroupContext.Provider>
  )
}

export default CustomerGroupContext
