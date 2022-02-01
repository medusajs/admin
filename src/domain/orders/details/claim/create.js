import React, { useState, useEffect, useRef, useContext } from "react"
import { Text, Flex, Box } from "rebass"
import styled from "@emotion/styled"
import { useForm } from "react-hook-form"

import Pill from "../../../../components/pill"
import Modal from "../../../../components/molecules/modal"
import ImageUpload from "../../../../components/image-upload"
import Input from "../../../../components/molecules/input"
import Button from "../../../../components/fundamentals/button"
import Dropdown from "../../../../components/dropdown"
import TextArea from "../../../../components/textarea"
import Select from "../../../../components/molecules/select"
import AddressForm from "../address-form"
import Medusa from "../../../../services/api"
import { filterItems } from "../utils/create-filtering"

import { ReactComponent as Trash } from "../../../../assets/svg/trash.svg"
import { ReactComponent as Edit } from "../../../../assets/svg/edit.svg"
import { ReactSelect } from "../../../../components/react-select"
import { extractOptionPrice } from "../../../../utils/prices"
import { getErrorMessage } from "../../../../utils/error-messages"
import RMASelectProductTable from "../../../../components/organisms/rma-select-product-table"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../components/molecules/modal/layered-modal"
import Spinner from "../../../../components/atoms/spinner"
import RMAShippingPrice from "../../../../components/molecules/rma-select-shipping"
import clsx from "clsx"
import RMAReturnProductsTable from "../../../../components/organisms/rma-return-product-table"
import RMASelectProductSubModal from "../rma-sub-modals/products"
import CurrencyInput from "../../../../components/organisms/currency-input"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import RMAEditAddressSubModal from "../rma-sub-modals/address"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import InfoTooltip from "../../../../components/molecules/info-tooltip"

const removeNullish = (obj) =>
  Object.entries(obj).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {})

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

const ClaimMenu = ({ order, onCreate, onDismiss, toaster }) => {
  console.log(order)
  const [shippingAddress, setShippingAddress] = useState({})
  const [countries, setCountries] = useState([])
  const [isReplace, toggleReplace] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [returnAll, setReturnAll] = useState(false)
  const [noNotification, setNoNotification] = useState(order.no_notification)
  const [toPay, setToPay] = useState(0)
  const [toReturn, setToReturn] = useState({})
  const [quantities, setQuantities] = useState([])

  const [itemsToAdd, setItemsToAdd] = useState([])
  const [shippingLoading, setShippingLoading] = useState(true)
  const [returnShippingOptions, setReturnShippingOptions] = useState([])
  const [returnShippingMethod, setReturnShippingMethod] = useState()
  const [returnShippingPrice, setReturnShippingPrice] = useState()
  const [shippingOptions, setShippingOptions] = useState([])
  const [shippingMethod, setShippingMethod] = useState()
  const [shippingPrice, setShippingPrice] = useState()
  const [showCustomPrice, setShowCustomPrice] = useState({
    standard: false,
    return: false,
  })
  const [customOptionPrice, setCustomOptionPrice] = useState({
    standard: 0,
    return: null,
  })
  const [searchResults, setSearchResults] = useState([])
  const [ready, setReady] = useState(false)

  const layeredModalContext = useContext(LayeredModalContext)

  // Includes both order items and swap items
  const [allItems, setAllItems] = useState([])

  const handleReturnToggle = (item) => {
    const id = item.id

    const newReturns = { ...toReturn }

    if (id in toReturn) {
      delete newReturns[id]
    } else {
      newReturns[id] = {
        tags: [],
        images: [],
        reason: null,
        note: "",
        quantity: item.quantity - item.returned_quantity,
      }
    }

    setToReturn(newReturns)
  }

  const formatAddress = (address) => {
    const addr = [address.address_1]
    if (address.address_2) {
      addr.push(address.address_2)
    }

    const city = `${address.postal_code} ${address.city}`

    return `${addr.join(", ")}, ${city}, ${address.country_code?.toUpperCase()}`
  }

  useEffect(() => {
    if (order) {
      setAllItems(filterItems(order, true))
    }
  }, [order])

  useEffect(() => {
    Medusa.regions.retrieve(order.region_id).then(({ data }) => {
      setCountries(data.region.countries.map((c) => c.iso_2))
    })
    Medusa.shippingOptions
      .list({
        region_id: order.region_id,
        is_return: true,
      })
      .then(({ data }) => {
        setReturnShippingOptions(data.shipping_options)
        setShippingLoading(false)
      })
  }, [])

  useEffect(() => {
    Medusa.regions.retrieve(order.region_id).then(({ data }) => {
      setCountries(data.region.countries.map((c) => c.iso_2))
    })
    Medusa.shippingOptions
      .list({
        region_id: order.region_id,
        is_return: false,
      })
      .then(({ data }) => {
        setShippingOptions(data.shipping_options)
        setShippingLoading(false)
      })
  }, [])

  useEffect(() => {
    if (toReturn) {
      if (
        Object.keys(toReturn).length !== 0 &&
        isReplace &&
        itemsToAdd.length > 0 &&
        shippingMethod
      ) {
        setReady(true)
      } else if (!isReplace && Object.keys(toReturn).length !== 0) {
        setReady(true)
      } else {
        setReady(false)
      }
    } else {
      setReady(false)
    }
  }, [toReturn, isReplace, itemsToAdd, shippingMethod])

  useEffect(() => {
    if (!isReplace) {
      setShippingMethod()
      setShippingPrice()
      setShowCustomPrice({
        ...showCustomPrice,
        standard: false,
      })
    }
  }, [isReplace])

  useEffect(() => {
    setCustomOptionPrice({
      ...customOptionPrice,
      standard: 0,
    })
  }, [shippingMethod, showCustomPrice])

  // useEffect(() => {
  //  const items = toReturn.map(t => order.items.find(i => i.id === t))
  //  const returnTotal =
  //    items.reduce((acc, next) => {
  //      return acc + (next.refundable / next.quantity) * quantities[next.id]
  //    }, 0) - (shippingPrice || 0)

  //  const newItemsTotal = itemsToAdd.reduce((acc, next) => {
  //    const price = extractPrice(next.prices, order)
  //    const lineTotal = price * 100 * next.quantity
  //    return acc + lineTotal
  //  }, 0)

  //  setToPay(newItemsTotal - returnTotal)
  // }, [toReturn, quantities, shippingPrice, itemsToAdd])

  const handleQuantity = (e, item) => {
    const element = e.target
    const newReturns = {
      ...toReturn,
      [item.id]: {
        ...toReturn[item.id],
        quantity: parseInt(element.value),
      },
    }

    setToReturn(newReturns)
  }

  const onSubmit = () => {
    const claim_items = Object.entries(toReturn).map(([key, val]) => {
      const clean = removeNullish(val)
      return {
        item_id: key,
        ...clean,
      }
    })

    const data = {
      type: isReplace ? "replace" : "refund",
      claim_items,
      additional_items: itemsToAdd.map((i) => ({
        variant_id: i.id,
        quantity: i.quantity,
      })),
      no_notification:
        noNotification !== order.no_notification ? noNotification : undefined,
    }

    if (shippingAddress.address_1) {
      data.shipping_address = shippingAddress
    }

    if (returnShippingMethod) {
      data.return_shipping = {
        option_id: returnShippingMethod.id,
        price:
          showCustomPrice.return && customOptionPrice.return
            ? customOptionPrice.return * 100
            : Math.round(returnShippingPrice / (1 + order.tax_rate / 100)),
      }
    }

    if (shippingMethod) {
      data.shipping_methods = [
        {
          option_id: shippingMethod.id,
          price: customOptionPrice.standard * 100,
        },
      ]
    }

    if (onCreate) {
      setSubmitting(true)
      return onCreate(data)
        .then(() => onDismiss())
        .then(() => toaster("Successfully created claim", "success"))
        .catch((error) => toaster(getErrorMessage(error), "error"))
        .finally(() => setSubmitting(false))
    }
  }

  const handleToAddQuantity = (value, index) => {
    const updated = [...itemsToAdd]
    updated[index] = {
      ...itemsToAdd[index],
      quantity: itemsToAdd[index].quantity + value,
    }

    setItemsToAdd(updated)
  }

  const handleRemoveItem = (index) => {
    const updated = [...itemsToAdd]
    updated.splice(index, 1)
    setItemsToAdd(updated)
  }

  const handleReturnAll = () => {
    if (returnAll) {
      setToReturn([])
      setReturnAll(false)
    } else {
      const newReturns = []
      const newQuantities = {}
      for (const item of order.items) {
        if (!item.returned) {
          newReturns[item.id] = {
            quantity: item.quantity - item.returned_quantity,
          }
        }
      }
      // setQuantities(newQuantities)
      setToReturn(newReturns)
      setReturnAll(true)
    }
  }

  const handleAddImage = (e, item) => {
    Medusa.uploads.create(e.target.files).then(({ data }) => {
      const uploaded = data.uploads.map(({ url }) => url)

      setToReturn((prev) => ({
        ...prev,
        [item.id]: {
          ...(prev[item.id] || {}),
          images: [...prev[item.id].images, ...uploaded],
        },
      }))
    })
  }

  const handleImageDelete = (url, item) => {
    Medusa.uploads.delete(url[0]).then(() => {
      setToReturn({
        ...toReturn,
        [item.id]: {
          ...(toReturn[item.id] || {}),
          images: toReturn[item.id].images.filter((im) => im !== url),
        },
      })
    })
  }

  const handleReasonChange = (e, item) => {
    const element = e.target

    setToReturn((prev) => ({
      ...prev,
      [item.id]: {
        ...(prev[item.id] || {}),
        reason: element.value,
      },
    }))
  }

  const handleReturnShippingSelected = (so) => {
    const selectSo = returnShippingOptions.find((s) => so.value === s.id)
    if (selectSo) {
      setReturnShippingMethod(selectSo)
      setReturnShippingPrice(selectSo.amount * (1 + order.tax_rate / 100))
    } else {
      setReturnShippingMethod()
      setReturnShippingPrice(0)
    }
  }

  const handleShippingSelected = (so) => {
    const selectSo = shippingOptions.find((s) => so.value === s.id)
    if (selectSo) {
      setShippingMethod(selectSo)
      setShippingPrice(selectSo.amount * (1 + order.tax_rate / 100))
    } else {
      setShippingMethod()
      setShippingPrice(0)
    }
  }

  // const handleUpdateShippingPrice = e => {
  //   const element = e.target
  //   const value = element.value
  //   if (value >= 0) {
  //     setShippingPrice(parseFloat(value) * 100)
  //   }
  // }

  const handleProductSelect = (variants) => {
    setItemsToAdd((itemsToAdd) => [
      ...itemsToAdd,
      ...variants
        .filter((variant) => itemsToAdd.indexOf((v) => v.id === variant.id) < 0)
        .map((variant) => ({ ...variant, quantity: 1 })),
    ])
  }

  return (
    <LayeredModal context={layeredModalContext} handleClose={onDismiss}>
      <Modal.Body>
        <Modal.Header handleClose={onDismiss}>
          <h2 class="inter-xlarge-semibold">Create Claim</h2>
        </Modal.Header>
        <Modal.Content>
          <div>
            <h3 className="inter-base-semibold">Items to claim</h3>
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
            <h3 className="inter-base-semibold ">
              Shipping Return{" "}
              {returnShippingMethod && (
                <span className="text-grey-40 inter-base-regular">
                  ({returnShippingMethod.region.name})
                </span>
              )}
            </h3>
            {shippingLoading ? (
              <div className="flex justify-center">
                <Spinner size="medium" variant="secondary" />
              </div>
            ) : (
              <Select
                label="Shipping Method"
                className="mt-2"
                overrideStrings={{ search: "Add a shipping method" }}
                value={
                  returnShippingMethod
                    ? {
                        label: returnShippingMethod.name,
                        value: returnShippingMethod.id,
                      }
                    : null
                }
                onChange={handleReturnShippingSelected}
                options={returnShippingOptions.map((o) => ({
                  label: o.name,
                  value: o.id,
                }))}
              />
            )}
            {returnShippingMethod && (
              <RMAShippingPrice
                useCustomShippingPrice={showCustomPrice.return}
                shippingPrice={customOptionPrice.return || null}
                currency_code={returnShippingMethod.region.currency_code}
                updateShippingPrice={(value) =>
                  setCustomOptionPrice({
                    ...customOptionPrice,
                    return: value,
                  })
                }
                setUseCustomShippingPrice={(value) => {
                  setCustomOptionPrice({
                    ...customOptionPrice,
                    return: returnShippingMethod.amount,
                  })

                  setShowCustomPrice({
                    ...showCustomPrice,
                    return: value,
                  })
                }}
              />
            )}
          </div>
          <div className="flex w-full mt-4 items-center inter-base-regular gap-x-xlarge">
            <div
              className="cursor-pointer items-center flex"
              onClick={() => {
                toggleReplace(true)
              }}
            >
              <div
                className={clsx(
                  "rounded-full w-5 h-5 flex mr-3 items-center justify-center",
                  {
                    "border-violet-60 border-2": isReplace,
                    "border-grey-40 border": !isReplace,
                  }
                )}
              >
                {isReplace && (
                  <div className="w-3 h-3 bg-violet-60 rounded-full"></div>
                )}
              </div>
              Replace
            </div>
            <div
              className="cursor-pointer items-center flex"
              onClick={() => {
                toggleReplace(false)
              }}
            >
              <div
                className={clsx(
                  "rounded-full w-5 h-5 flex mr-3 items-center justify-center",
                  {
                    "border-violet-60 border-2": !isReplace,
                    "border-grey-40 border": isReplace,
                  }
                )}
              >
                {!isReplace && (
                  <div className="w-3 h-3 bg-violet-60 rounded-full"></div>
                )}
              </div>
              Refund
            </div>
          </div>
          {isReplace && (
            <div className="mt-8">
              <div className="flex justify-between items-center">
                <h3 className="inter-base-semibold ">Items to send</h3>
                {itemsToAdd.length === 0 ? (
                  <Button
                    variant="ghost"
                    className="border border-grey-20"
                    size="small"
                    onClick={() => {
                      layeredModalContext.push(
                        SelectProductsScreen(
                          layeredModalContext.pop,
                          itemsToAdd,
                          handleProductSelect
                        )
                      )
                    }}
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
                  />

                  <div className="flex w-full justify-end">
                    <Button
                      variant="ghost"
                      className="border border-grey-20"
                      size="small"
                      onClick={() => {
                        layeredModalContext.push(
                          SelectProductsScreen(
                            layeredModalContext.pop,
                            itemsToAdd,
                            handleProductSelect
                          )
                        )
                      }}
                    >
                      Add Product
                    </Button>
                  </div>
                </>
              )}
              <div className="mt-8">
                <span className="inter-base-semibold">Shipping Address</span>
                {shippingAddress.address_1 ? (
                  <>
                    <div className="flex w-full inter-small-regular text-grey-50">
                      {formatAddress(shippingAddress)}
                    </div>
                    <div className="flex w-full justify-end">
                      <Button
                        onClick={() => {
                          layeredModalContext.push(
                            showEditAddressScreen(
                              layeredModalContext.pop,
                              shippingAddress,
                              order,
                              countries,
                              setShippingAddress
                            )
                          )
                        }}
                        variant="ghost"
                        size="small"
                        className="border border-grey-20"
                      >
                        Edit
                      </Button>
                    </div>
                  </>
                ) : (
                  <div>
                    <span className="flex w-full inter-small-regular text-grey-50">
                      {formatAddress(order.shipping_address)}
                    </span>
                    <div className="flex w-full justify-end">
                      <Button
                        onClick={() => {
                          layeredModalContext.push(
                            showEditAddressScreen(
                              layeredModalContext.pop,
                              order.shipping_address,
                              order,
                              countries,
                              setShippingAddress
                            )
                          )
                        }}
                        variant="ghost"
                        size="small"
                        className="border border-grey-20"
                      >
                        Ship to a different address
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="inter-base-semibold mt-8">Shipping new</h3>
                <span className="inter-small-regular text-grey-50">
                  Shipping new items is free pr. default. Use custom price, if
                  this is not the case
                </span>
                <Select
                  label="Shipping Method"
                  className="mt-2"
                  overrideStrings={{ search: "Add a shipping method" }}
                  value={
                    shippingMethod
                      ? {
                          label: shippingMethod?.name,
                          value: shippingMethod?.id,
                        }
                      : null
                  }
                  onChange={handleShippingSelected}
                  options={
                    shippingOptions.map((o) => ({
                      label: o.name,
                      value: o.id,
                    })) || []
                  }
                />
                <div>
                  {shippingMethod ? (
                    <>
                      <div className="flex justify-end w-full">
                        {!showCustomPrice.standard && (
                          <Button
                            variant="ghost"
                            size="small"
                            className="border border-grey-20 mt-4 "
                            disabled={!shippingMethod}
                            onClick={() =>
                              setShowCustomPrice({
                                ...showCustomPrice,
                                standard: true,
                              })
                            }
                          >
                            {showCustomPrice.standard
                              ? "Submit"
                              : "Set custom price"}
                          </Button>
                        )}
                        {showCustomPrice.standard && (
                          <div className="flex w-full items-center">
                            <CurrencyInput
                              readOnly
                              className="mt-4 w-full"
                              size="small"
                              currentCurrency={order.currency_code}
                            >
                              <CurrencyInput.AmountInput
                                label={"Amount"}
                                amount={customOptionPrice.standard}
                                onChange={(value) =>
                                  setCustomOptionPrice({
                                    ...customOptionPrice,
                                    standard: value,
                                  })
                                }
                              />
                            </CurrencyInput>
                            <Button
                              onClick={() =>
                                setShowCustomPrice({
                                  ...showCustomPrice,
                                  standard: false,
                                })
                              }
                              className="w-8 h-8 ml-8 text-grey-40"
                              variant="ghost"
                              size="small"
                            >
                              <TrashIcon size={20} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </Modal.Content>
        <Modal.Footer>
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
                onChange={() => setNoNotification(!noNotification)}
                type="checkbox"
              />
              <span className="ml-3 flex items-center text-grey-90 gap-x-xsmall">
                Send notifications
                <InfoTooltip content="Notify customer of created return" />
              </span>
            </div>
            <div className="flex gap-x-xsmall">
              <Button
                onClick={() => onDismiss()}
                className="w-[112px]"
                type="submit"
                size="small"
                variant="ghost"
              >
                Back
              </Button>
              <Button
                onClick={onSubmit}
                disabled={!ready}
                loading={submitting}
                className="w-[112px]"
                size="small"
                variant="primary"
              >
                Complete
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
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

const showEditAddressScreen = (
  pop,
  address,
  order,
  countries,
  setShippingAddress
) => {
  return {
    title: "Edit Address",
    onBack: () => pop(),
    view: (
      <RMAEditAddressSubModal
        onSubmit={setShippingAddress}
        address={address}
        order={order}
        countries={countries}
      />
    ),
  }
}

export default ClaimMenu
