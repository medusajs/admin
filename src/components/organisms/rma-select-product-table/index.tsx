import clsx from "clsx"
import React from "react"
import Button from "../../fundamentals/button"
import CheckIcon from "../../fundamentals/icons/check-icon"
import MinusIcon from "../../fundamentals/icons/minus-icon"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import Table from "../../molecules/table"

type RMASelectProductTableProps = {
  order: any
  allItems: any[]
  toReturn: any[]
  setToReturn: (items: any[]) => void
  quantities: any
  setQuantities: (quantities: any[]) => void
}

const RMASelectProductTable: React.FC<RMASelectProductTableProps> = ({
  order,
  allItems,
  toReturn,
  quantities,
  setQuantities,
  setToReturn,
}) => {
  const handleQuantity = (change, item) => {
    if (
      (item.quantity - item.returned_quantity === quantities[item.id] &&
        change > 0) ||
      (quantities[item.id] === 1 && change < 0)
    ) {
      return
    }
    const newQuantities = {
      ...quantities,
      [item.id]: quantities[item.id] + change,
    }

    setQuantities(newQuantities)
  }

  const handleReturnToggle = (item) => {
    const id = item.id
    const idx = toReturn.indexOf(id)
    if (idx !== -1) {
      const newReturns = [...toReturn]
      newReturns.splice(idx, 1)
      setToReturn(newReturns)
    } else {
      const newReturns = [...toReturn, id]
      setToReturn(newReturns)

      const newQuantities = {
        ...quantities,
        [item.id]: item.quantity - item.returned_quantity,
      }

      setQuantities(newQuantities)
    }
  }

  const isLineItemCanceled = (item) => {
    const { swap_id, claim_order_id } = item
    const travFind = (col, id) =>
      col.filter((f) => f.id == id && f.canceled_at).length > 0

    if (swap_id) {
      return travFind(order.swaps, swap_id)
    }
    if (claim_order_id) {
      return travFind(order.claims, claim_order_id)
    }
    return false
  }

  return (
    <Table>
      <Table.HeadRow className="text-grey-50 inter-small-semibold">
        <Table.HeadCell colspan={2}>Product Details</Table.HeadCell>
        <Table.HeadCell className="text-right pr-8">Quantity</Table.HeadCell>
        <Table.HeadCell className="text-right">Refundable</Table.HeadCell>
        <Table.HeadCell></Table.HeadCell>
      </Table.HeadRow>
      <Table.Body>
        {allItems.map((item) => {
          // Only show items that have not been returned,
          // and aren't canceled
          if (
            item.returned_quantity === item.quantity ||
            isLineItemCanceled(item)
          ) {
            return
          }
          const checked = !!toReturn?.includes(item.id)
          return (
            <>
              <Table.Row className={clsx("border-b-grey-0 hover:bg-grey-0")}>
                <Table.Cell>
                  <div className="items-center ml-1 h-full flex">
                    <div
                      onClick={() => handleReturnToggle(item)}
                      className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border cursor-pointer rounded-base ${
                        checked && "bg-violet-60"
                      }`}
                    >
                      <span className="self-center">
                        {checked && <CheckIcon size={16} />}
                      </span>
                    </div>

                    <input
                      className="hidden"
                      checked={checked}
                      tabIndex={-1}
                      onChange={() => handleReturnToggle(item)}
                      type="checkbox"
                    />
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="min-w-[240px] flex py-2">
                    <div className="w-[30px] h-[40px] ">
                      <img
                        className="h-full w-full object-cover rounded"
                        src={item.thumbnail}
                      />
                    </div>
                    <div className="inter-small-regular text-grey-50 flex flex-col ml-4">
                      <span>
                        <span className="text-grey-90">{item.title}</span> test
                      </span>
                      <span>{item.variant.title}</span>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="text-right w-32 pr-8">
                  {toReturn.includes(item.id) ? (
                    <div className="flex w-full text-right justify-end text-grey-50 ">
                      <span
                        onClick={() => handleQuantity(-1, item)}
                        className="w-5 h-5 flex items-center justify-center rounded cursor-pointer hover:bg-grey-20 mr-2"
                      >
                        <MinusIcon size={16} />
                      </span>
                      <span>{quantities[item.id] || ""}</span>
                      <span
                        onClick={() => handleQuantity(1, item)}
                        className={clsx(
                          "w-5 h-5 flex items-center justify-center rounded cursor-pointer hover:bg-grey-20 ml-2"
                        )}
                      >
                        <PlusIcon size={16} />
                      </span>
                    </div>
                  ) : (
                    <span className="text-grey-40">
                      {item.quantity - item.returned_quantity}
                    </span>
                  )}
                </Table.Cell>
                <Table.Cell className="text-right">
                  {(item.refundable / 100).toFixed(2)}
                </Table.Cell>
                <Table.Cell className="text-right text-grey-40 pr-1">
                  {order.currency_code.toUpperCase()}
                </Table.Cell>
              </Table.Row>
              {/* {checked && (
                <Table.Row className="last:border-b-0 hover:bg-grey-0">
                  <Table.Cell colspan={5}>
                    <div className="w-full flex justify-end">
                      <Button
                        variant="ghost"
                        size="small"
                        className="border border-grey-20"
                      >
                        Select Reason
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )} */}
            </>
          )
        })}
      </Table.Body>
    </Table>
  )
}

export default RMASelectProductTable
