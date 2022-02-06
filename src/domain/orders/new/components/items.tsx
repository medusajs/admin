import React, { useContext, useEffect, useState } from "react"
import clsx from "clsx"

import Button from "../../../../components/fundamentals/button"
import { displayAmount, extractUnitPrice } from "../../../../utils/prices"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import { LayeredModalContext } from "../../../../components/molecules/modal/layered-modal"
import RMASelectProductSubModal from "../../details/rma-sub-modals/products"
import Table from "../../../../components/molecules/table"
import InputField from "../../../../components/molecules/input"
import MinusIcon from "../../../../components/fundamentals/icons/minus-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import CustomItemSubModal from "./custom-item-sub-modal"
import { SteppedContext } from "../../../../components/molecules/modal/stepped-modal"
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"

const Items = ({
  items,
  handleAddItems,
  handleAddQuantity,
  handleRemoveItem,
  selectedRegion,
  handlePriceChange,
  handleAddCustom,
}) => {
  const { enableNextPage, disableNextPage, nextStepEnabled } = React.useContext(
    SteppedContext
  )
  const [editQuantity, setEditQuantity] = useState(-1)
  const [editPrice, setEditPrice] = useState(-1)

  const layeredContext = useContext(LayeredModalContext)

  const addItem = (variants) => {
    handleAddItems(variants)

    if (!nextStepEnabled) {
      enableNextPage()
    }
  }

  const addCustomItem = (title, quantity, amount) => {
    handleAddCustom({
      title,
      unit_price: amount,
      quantity: quantity,
    })

    if (!nextStepEnabled) {
      enableNextPage()
    }
  }

  const removeItem = (index) => {
    handleRemoveItem(index)

    if (nextStepEnabled && items.length === 1) {
      disableNextPage()
    }
  }

  useEffect(() => {
    if (items.length) {
      enableNextPage()
    } else {
      disableNextPage()
    }
  }, [])

  return (
    <div className="flex flex-col min-h-[705px] pt-4">
      <span className="inter-base-semibold mb-4">Items for the order</span>
      {items.length > 0 && (
        <Table>
          <Table.HeadRow className="text-grey-50 border-t inter-small-semibold">
            <Table.HeadCell>Details</Table.HeadCell>
            <Table.HeadCell className="text-right pr-8">
              Quantity
            </Table.HeadCell>
            <Table.HeadCell className="text-right">
              Price (excl. Taxes)
            </Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.HeadRow>
          {items.map((item, index) => {
            const itemPrice = extractUnitPrice(item, selectedRegion, false)

            return (
              <Table.Row className={clsx("border-b-grey-0 hover:bg-grey-0")}>
                <Table.Cell>
                  <div className="min-w-[240px] flex py-2">
                    <div className="w-[30px] h-[40px] ">
                      {item?.product?.thumbnail ? (
                        <img
                          className="h-full w-full object-cover rounded"
                          src={item.product.thumbnail}
                        />
                      ) : (
                        <ImagePlaceholder />
                      )}
                    </div>
                    <div className="inter-small-regular text-grey-50 flex flex-col ml-4">
                      <span>
                        <span className="text-grey-90">
                          {item.product?.title}
                        </span>{" "}
                      </span>
                      <span>{item?.title || ""}</span>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="text-right w-32 pr-8">
                  {editQuantity === index ? (
                    <InputField
                      label=""
                      type="number"
                      value={item.quantity}
                      onBlur={() => {
                        setEditQuantity(-1)
                      }}
                      onChange={(e) => handleAddQuantity(e.target.value, index)}
                    />
                  ) : (
                    <div className="flex w-full text-right justify-end text-grey-50 ">
                      <span
                        onClick={() =>
                          handleAddQuantity(item.quantity - 1, index)
                        }
                        className="w-5 h-5 flex items-center justify-center rounded cursor-pointer hover:bg-grey-20 mr-2"
                      >
                        <MinusIcon size={16} />
                      </span>
                      <span
                        className="px-1 hover:bg-grey-20 rounded cursor-pointer"
                        onClick={() => setEditQuantity(index)}
                      >
                        {item.quantity}
                      </span>
                      <span
                        onClick={() =>
                          handleAddQuantity(item.quantity + 1, index)
                        }
                        className={clsx(
                          "w-5 h-5 flex items-center justify-center rounded cursor-pointer hover:bg-grey-20 ml-2"
                        )}
                      >
                        <PlusIcon size={16} />
                      </span>
                    </div>
                  )}
                </Table.Cell>
                <Table.Cell className="text-right">
                  {editPrice === index ? (
                    <InputField
                      label=""
                      type="number"
                      value={itemPrice / 100}
                      onBlur={() => {
                        setEditPrice(-1)
                      }}
                      onChange={(e) => handlePriceChange(e.target.value, index)}
                    />
                  ) : (
                    <span
                      className="cursor-pointer"
                      onClick={() => setEditPrice(index)}
                    >
                      {displayAmount(selectedRegion.currency_code, itemPrice)}
                    </span>
                  )}
                </Table.Cell>
                <Table.Cell className="text-right text-grey-40 pr-1">
                  {selectedRegion.currency_code.toUpperCase()}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    className="w-5 h-5 hover:bg-grey-20"
                    variant="ghost"
                    size="small"
                    onClick={() => removeItem(index)}
                  >
                    <TrashIcon size={20} />
                  </Button>
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table>
      )}
      <div className="flex w-full justify-end mt-3 gap-x-xsmall">
        <Button
          variant="ghost"
          size="small"
          className="border border-grey-20"
          onClick={() => {
            layeredContext.push(
              CreateCustomProductScreen(
                layeredContext.pop,
                addCustomItem,
                selectedRegion
              )
            )
          }}
        >
          <PlusIcon size={20} />
          Add Custom
        </Button>
        <Button
          variant="ghost"
          size="small"
          className="border border-grey-20"
          onClick={() => {
            layeredContext.push(
              SelectProductsScreen(layeredContext.pop, items, addItem)
            )
          }}
        >
          <PlusIcon size={20} />
          Add Existing
        </Button>
      </div>
    </div>
  )
}

const SelectProductsScreen = (pop, itemsToAdd, setSelectedItems) => {
  return {
    title: "Add Products",
    onBack: () => pop(),
    view: (
      <RMASelectProductSubModal
        selectedItems={itemsToAdd || []}
        onSubmit={setSelectedItems}
      />
    ),
  }
}

const CreateCustomProductScreen = (pop, onSubmit, region) => {
  return {
    title: "Add Custom Item",
    onBack: () => pop(),
    view: <CustomItemSubModal onSubmit={onSubmit} region={region} />,
  }
}

export default Items
