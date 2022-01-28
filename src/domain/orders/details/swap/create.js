import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import Modal from "../../../../components/molecules/modal"
import Button from "../../../../components/fundamentals/button"
import Select from "../../../../components/molecules/select"
import Medusa from "../../../../services/api"
import { filterItems } from "../utils/create-filtering"
import { getErrorMessage } from "../../../../utils/error-messages"
import RMASelectProductTable from "../../../../components/organisms/rma-select-product-table"
import Spinner from "../../../../components/atoms/spinner"
import RMAShippingPrice from "../../../../components/molecules/rma-select-shipping"
import RMAReturnProductsTable from "../../../../components/organisms/rma-return-product-table"
import InfoTooltip from "../../../../components/molecules/info-tooltip"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"

const extractPrice = (prices, order) => {
  let price = prices.find((ma) => ma.region_id === order.region_id)

  if (!price) {
    price = prices.find((ma) => ma.currency_code === order.currency_code)
  }

  if (price) {
    return (price.amount * (1 + order.tax_rate / 100)) / 100
  }

  return 0
}

const SwapMenu = ({ order, onCreate, onDismiss, toaster }) => {
  const [submitting, setSubmitting] = useState(false)
  const [toPay, setToPay] = useState(0)
  const [toReturn, setToReturn] = useState([])
  const [quantities, setQuantities] = useState({})
  const [useCustomShippingPrice, setUseCustomShippingPrice] = useState(false)

  const [itemsToAdd, setItemsToAdd] = useState([])
  const [shippingLoading, setShippingLoading] = useState(true)
  const [shippingOptions, setShippingOptions] = useState([])
  const [shippingMethod, setShippingMethod] = useState()
  const [shippingPrice, setShippingPrice] = useState()
  const [noNotification, setNoNotification] = useState(order.no_notification)
  const [searchResults, setSearchResults] = useState([])

  // Includes both order items and swap items
  const [allItems, setAllItems] = useState([])

  const { register, setValue, handleSubmit } = useForm()

  useEffect(() => {
    if (order) {
      setAllItems(filterItems(order, false))
    }
  }, [order])

  const handleAddItemToSwap = (variant) => {
    setItemsToAdd([...itemsToAdd, { ...variant, quantity: 1 }])
  }

  // const isLineItemCanceled = (item) => {
  //   const { swap_id, claim_order_id } = item
  //   const travFind = (col, id) =>
  //     col.filter((f) => f.id == id && f.canceled_at).length > 0

  //   if (swap_id) {
  //     return travFind(order.swaps, swap_id)
  //   }
  //   if (claim_order_id) {
  //     return travFind(order.claims, claim_order_id)
  //   }
  //   return false
  // }

  // const handleReturnToggle = (item) => {
  //   const id = item.id
  //   const idx = toReturn.indexOf(id)
  //   if (idx !== -1) {
  //     const newReturns = [...toReturn]
  //     newReturns.splice(idx, 1)
  //     setToReturn(newReturns)

  //     if (returnAll) {
  //       setReturnAll(false)
  //     }
  //   } else {
  //     const newReturns = [...toReturn, id]
  //     setToReturn(newReturns)

  //     const newQuantities = {
  //       ...quantities,
  //       [item.id]: item.quantity - item.returned_quantity,
  //     }

  //     setQuantities(newQuantities)
  //   }
  // }

  useEffect(() => {
    Medusa.shippingOptions
      .list({
        region_id: order.region_id,
        is_return: true,
      })
      .then(({ data }) => {
        setShippingOptions(data.shipping_options)
        setShippingLoading(false)
      })
  }, [])

  useEffect(() => {
    const items = toReturn.map((t) => allItems.find((i) => i.id === t))
    const returnTotal =
      items.reduce((acc, next) => {
        return (
          acc +
          (next.refundable / (next.quantity - next.returned_quantity)) *
            quantities[next.id]
        )
      }, 0) - (shippingPrice || 0)

    const newItemsTotal = itemsToAdd.reduce((acc, next) => {
      const price = extractPrice(next.prices, order)
      const lineTotal = price * 100 * next.quantity
      return acc + lineTotal
    }, 0)

    setToPay(newItemsTotal - returnTotal)
  }, [toReturn, quantities, shippingPrice, itemsToAdd])

  // const handleQuantity = (e, item) => {
  //   const element = e.target
  //   const newQuantities = {
  //     ...quantities,
  //     [item.id]: parseInt(element.value),
  //   }

  //   setQuantities(newQuantities)
  // }

  const onSubmit = () => {
    const data = {
      return_items: toReturn.map((t) => ({
        item_id: t,
        quantity: quantities[t],
      })),
      additional_items: itemsToAdd.map((i) => ({
        variant_id: i.id,
        quantity: i.quantity,
      })),
      no_notification:
        noNotification !== order.no_notification ? noNotification : undefined,
    }

    if (shippingMethod) {
      data.return_shipping = {
        option_id: shippingMethod,
        price: Math.round(shippingPrice / (1 + order.tax_rate / 100)),
      }
    }

    if (onCreate) {
      setSubmitting(true)
      return onCreate(data)
        .then(() => onDismiss())
        .then(() => toaster("Successfully created swap", "success"))
        .catch((error) => toaster(getErrorMessage(error), "error"))
        .finally(() => setSubmitting(false))
    }
  }

  const handleToAddQuantity = (value, index) => {
    const updated = [...itemsToAdd]
    updated[index] = {
      ...itemsToAdd[index],
      quantity: value,
    }

    setItemsToAdd(updated)
  }

  const handleRemoveItem = (index) => {
    const updated = [...itemsToAdd]
    updated.splice(index, 1)
    setItemsToAdd(updated)
  }

  // const handleReturnAll = () => {
  //   if (returnAll) {
  //     setToReturn([])
  //     setReturnAll(false)
  //   } else {
  //     const newReturns = []
  //     const newQuantities = {}
  //     for (const item of order.items) {
  //       if (!item.returned) {
  //         newReturns.push(item.id)
  //         newQuantities[item.id] = item.quantity - item.returned_quantity
  //       }
  //     }
  //     setQuantities(newQuantities)
  //     setToReturn(newReturns)
  //     setReturnAll(true)
  //   }
  // }

  const handleShippingSelected = (selectedItem) => {
    if (selectedItem.value !== "Add a shipping method") {
      setShippingMethod(selectedItem)
      const method = shippingOptions.find((o) => selectedItem.value === o.id)
      setShippingPrice(method.amount * (1 + order.tax_rate / 100))
    } else {
      setShippingMethod()
      setShippingPrice(0)
    }
  }

  const handleUpdateShippingPrice = (value) => {
    if (value >= 0) {
      setShippingPrice(value)
    }
  }

  useEffect(() => {
    if (!useCustomShippingPrice && shippingMethod && shippingOptions) {
      const method = shippingOptions.find((o) => shippingMethod.value === o.id)
      console.log(shippingMethod, method)
      setShippingPrice(method.amount * (1 + order.tax_rate / 100))
    }
  }, [useCustomShippingPrice, shippingMethod])

  const handleProductSearch = (val) => {
    Medusa.variants
      .list({
        q: val,
      })
      .then(({ data }) => {
        setSearchResults(data.variants)
      })
  }

  return (
    <Modal handleClose={onDismiss}>
      <Modal.Body as="form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header handleClose={onDismiss}>
          <h2 className="inter-xlarge-semibold">Register Exchange</h2>
        </Modal.Header>
        <Modal.Content>
          <div className="mb-7">
            <h3 className="inter-base-semibold">Items to return</h3>
            <RMASelectProductTable
              order={order}
              allItems={allItems}
              toReturn={toReturn}
              setToReturn={(items) => setToReturn(items)}
              quantities={quantities}
              setQuantities={setQuantities}
            />
          </div>

          <div>
            <h3 className="inter-base-semibold ">Shipping</h3>
            {shippingLoading ? (
              <div className="flex justify-center">
                <Spinner size="medium" variant="secondary" />
              </div>
            ) : (
              <Select
                label="Shipping Method"
                className="mt-2"
                overrideStrings={{ search: "Add a shipping method" }}
                value={shippingMethod}
                onChange={handleShippingSelected}
                options={shippingOptions.map((o) => ({
                  label: o.name,
                  value: o.id,
                }))}
              />
            )}
            {shippingMethod && (
              <RMAShippingPrice
                useCustomShippingPrice={useCustomShippingPrice}
                shippingPrice={shippingPrice}
                currency_code={order.currency_code}
                updateShippingPrice={handleUpdateShippingPrice}
                setUseCustomShippingPrice={setUseCustomShippingPrice}
              />
            )}
          </div>

          {/* <Box my={3}>
            <Text>Items to send</Text>
            <Box mt={2}>
              <Dropdown
                leftAlign
                toggleText={"+ Add product"}
                showSearch
                onSearchChange={handleProductSearch}
                searchPlaceholder={"Search by SKU, Name, etch."}
              >
                {searchResults.map((s) => (
                  <Flex
                    key={s.variant_id}
                    alignItems="center"
                    onClick={() => handleAddItemToSwap(s)}
                  >
                    <Dot
                      mr={3}
                      bg={s.inventory_quantity > 0 ? "green" : "danger"}
                    />
                    <Box>
                      <Text fontSize={0} mb={0} lineHeight={1}>
                        {s.product.title} - {s.title}
                      </Text>
                      <Flex>
                        <Text width={"100px"} mt={0} fontSize={"10px"}>
                          {s.sku}
                        </Text>
                        <Text ml={2} mt={0} fontSize={"10px"}>
                          In stock: {s.inventory_quantity}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                ))}
              </Dropdown>
            </Box> */}

          <div className="flex justify-between mt-8 items-center">
            <h3 className="inter-base-semibold ">Items to send</h3>
            {itemsToAdd.length === 0 ? (
              <Button
                variant="ghost"
                className="border border-grey-20"
                size="small"
              >
                Add Product
              </Button>
            ) : (
              <></>
            )}
          </div>
          {itemsToAdd.length > 0 && (
            <>
              <RMAReturnProductsTable
                order={order}
                itemsToAdd={itemsToAdd}
                handleRemoveItem={handleRemoveItem}
                handleToAddQuantity={handleToAddQuantity}
                quantities={quantities}
              />

              <div className="flex w-full justify-end">
                <Button
                  variant="ghost"
                  className="border border-grey-20"
                  size="small"
                >
                  Add Product
                </Button>
              </div>
            </>
          )}
          {/* <Box mt={3}>
              {itemsToAdd.length > 0 && (
                <Flex
                  sx={{
                    borderBottom: "hairline",
                  }}
                  justifyContent="space-between"
                  fontSize={1}
                  py={2}
                >
                  <Box width={30} px={2} py={1}></Box>
                  <Box width={400} px={2} py={1}>
                    Details
                  </Box>
                  <Box width={75} px={2} py={1}>
                    Quantity
                  </Box>
                  <Box width={170} px={2} py={1}>
                    Price
                  </Box>
                </Flex>
              )}
              {itemsToAdd.map((item, index) => {
                return (
                  <Flex
                    key={item.variant_id}
                    justifyContent="space-between"
                    fontSize={2}
                    py={2}
                  >
                    <Box width={30} px={2} py={1}></Box>
                    <Box width={400} px={2} py={1}>
                      <Text fontSize={1} lineHeight={"14px"}>
                        {item.title}
                      </Text>
                      <Text fontSize={0}>{item.sku}</Text>
                    </Box>
                    <Box width={75} px={2} py={1}>
                      <Input
                        type="number"
                        onChange={(e) => handleToAddQuantity(e, index)}
                        value={item.quantity || ""}
                        min={1}
                      />
                    </Box>
                    <Box width={170} px={2} py={1}>
                      <Text fontSize={1}>
                        {extractPrice(item.prices, order).toFixed(2)}{" "}
                        {order.currency_code.toUpperCase()}
                      </Text>
                    </Box>
                    <Box onClick={() => handleRemoveItem(index)}>&times;</Box>
                  </Flex>
                )
              })}
          </Box>
            </Box> */}
          <div className="flex justify-between items-center inter-base-semibold mt-8">
            <span>Difference</span>
            <span className="inter-large-semibold">
              {(toPay / 100).toFixed(2)} {order.currency_code.toUpperCase()}
            </span>
          </div>
        </Modal.Content>
        <Modal.Footer justifyContent="space-between">
          <div className="flex w-full justify-between">
            <div
              className="items-center h-full flex cursor-pointer"
              onClick={() => setNoNotification(!noNotification)}
            >
              <div
                className={`w-5 h-5 flex justify-center text-grey-0 border-grey-30 border rounded-base ${
                  !noNotification && "bg-violet-60"
                }`}
              >
                <span className="self-center">
                  {!noNotification && <CheckIcon size={16} />}
                </span>
              </div>
              <input
                id="noNotification"
                className="hidden"
                name="noNotification"
                checked={!noNotification}
                type="checkbox"
              />
              <span className="ml-3 flex items-center text-grey-90 gap-x-xsmall">
                Send notifications
                <InfoTooltip content="Notify customer of created return" />
              </span>
            </div>

            <Button
              onClick={onSubmit}
              disabled={toReturn.length === 0 || itemsToAdd.length === 0}
              loading={submitting}
              type="submit"
              variant="primary"
            >
              Complete
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default SwapMenu
