import { useAdminOrders } from "medusa-react"
import React from "react"
import Timeline from "../components/organisms/timeline"

const B = () => {
  const { orders } = useAdminOrders()
  return (
    <div className="w-full min-h-screen bg-grey-5 flex justify-end p-xlarge">
      <div className="max-w-md">
        <Timeline orderId={orders ? orders[0].id : "id_1"} />
      </div>
    </div>
  )
}

export default B
