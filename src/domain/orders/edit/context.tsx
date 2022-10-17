import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react"
import { useAdminOrderEdits } from "medusa-react"
import { OrderEdit } from "@medusajs/medusa"

import useToggleState from "../../../hooks/use-toggle-state"

export type IOrderEditContext = {
  showModal: () => void
  hideModal: () => void

  isModalVisible: boolean

  activeOrderEditId?: string
  setActiveOrderEdit: (orderEditId?: string) => string

  orderEdits?: OrderEdit[]
}

// @ts-ignore
export const OrderEditContext = createContext<IOrderEditContext>({})

type OrderEditProviderProps = PropsWithChildren<{ orderId: string }>

function OrderEditProvider(props: OrderEditProviderProps) {
  const { orderId } = props
  const [isModalVisible, showModal, hideModal] = useToggleState(false)
  const [activeOrderEditId, setActiveOrderEdit] = useState<string>()

  var { order_edits, count } = useAdminOrderEdits({
    order_id: orderId,
    limit: count,
  })

  useEffect(() => {
    const activeOrderEdit = order_edits?.find((oe) => oe.status === "created")

    if (activeOrderEdit) {
      setActiveOrderEdit(activeOrderEdit.id)
    }
  }, [order_edits])

  const value = {
    isModalVisible,
    showModal,
    hideModal,
    orderEdits: order_edits,
    activeOrderEditId,
    setActiveOrderEdit,
  }

  return <OrderEditContext.Provider value={value} children={props.children} />
}

export default OrderEditProvider
