import React, { useCallback, useState } from "react"
import { Text, Flex, Box, Image } from "rebass"
import ReactJson from "react-json-view"
import styled from "@emotion/styled"
import { navigate } from "gatsby"
import Medusa from "../../../services/api"
import moment from "moment"
import ReactTooltip from "react-tooltip"

import CustomerInformation from "../details/customer"

import { ReactComponent as Clipboard } from "../../../assets/svg/clipboard.svg"
import ImagePlaceholder from "../../../assets/svg/image-placeholder.svg"
import Card from "../../../components/card"
import Badge from "../../../components/badge"
import Spinner from "../../../components/spinner"

import { decideBadgeColor } from "../../../utils/decide-badge-color"
import useMedusa from "../../../hooks/use-medusa"
import Typography from "../../../components/typography"
import Modal from "../../../components/modal"
import Items from "../new/components/items"
import Button from "../../../components/button"

const LineItemImage = styled(Image)`
  height: 30px;
  width: 30px;
  object-fit: contain;
  border: 1px solid lightgray;
`

const LineItemLabel = styled(Text)`
  ${Typography.Base};

  cursor: pointer;

  font-size: 10px;
`

const AlignedDecimal = ({ value, currency }) => {
  const fixed = (value / 100).toFixed(2)
  const [numPart, decimalPart] = fixed.split(".")

  return (
    <Flex>
      <Box flex={1} textAlign="right">
        {numPart}
      </Box>
      .<div>{decimalPart}</div>
      <Box ml={2}>{currency.toUpperCase()}</Box>
    </Flex>
  )
}

const AddItemModal = ({
  handleAddItem,
  handleAddQuantity,
  handleProductSearch,
  handleRemoveItem,
  addCustomItem,
  region,
  items,
  searchResults,
  extractPrice,
  isAddingItem,
}) => {
  return (
    <Modal onClick={() => console.log("yello")}>
      <Modal.Body>
        <Modal.Header>Add item</Modal.Header>
        <Modal.Content flexDirection="column" minWidth="600px">
          <Items
            handleAddItem={handleAddItem}
            handleAddQuantity={handleAddQuantity}
            handleProductSearch={handleProductSearch}
            handleRemoveItem={handleRemoveItem}
            handleAddCustom={addCustomItem}
            extractPrice={extractPrice}
            selectedRegion={region}
            searchResults={searchResults}
            items={items}
          />
        </Modal.Content>
        <Modal.Footer justifyContent="">
          <Button loading={false} variant="primary">
            Cancel
          </Button>
          <Box ml="auto" />
          <Button loading={isAddingItem} variant="cta">
            Save
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

const DraftOrderDetails = ({ id }) => {
  const [showEditCustomer, setShowEditCustomer] = useState(false)
  const [deletingOrder, setDeletingOrder] = useState(false)
  const [items, setItems] = useState([])
  const [isAddingItem, setIsAddingItem] = useState(false)
  const [handlingPayment, setHandlingPayment] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [paymentType, setPaymentType] = useState("")

  const { store } = useMedusa("store")
  const { draft_order: draftOrder, update, isLoading, toaster } = useMedusa(
    "draftOrders",
    {
      id,
    }
  )

  const { regions } = useMedusa("regions")

  const addCustomItem = async ({ title, price, quantity }) => {
    try {
      setIsAddingItem(true)
      const line = { title, unit_price: price, quantity: quantity || 1 }
      await Medusa.draftOrders.addLineItem(id, line)
      setIsAddingItem(false)
    } catch (error) {
      setIsAddingItem(false)
    }
  }

  const handleAddItem = async (variant, quantity) => {
    try {
      setIsAddingItem(true)
      const line = { ...variant, quantity }
      await Medusa.draftOrders.addLineItem(id, line)
      setIsAddingItem(false)
    } catch (error) {
      setIsAddingItem(false)
    }
  }

  const handleRemoveItem = index => {
    const updated = [...items]
    updated.splice(index, 1)
    setItems(updated)
  }

  const handleDeleteOrder = async () => {
    setDeletingOrder(true)
    await Medusa.draftOrders
      .delete(id)
      .then(() => {
        navigate("/a/orders?tab=draft-orders")
        setDeletingOrder(false)
      })
      .catch(() => setDeletingOrder(false))
  }

  const handleProductSearch = val => {
    Medusa.variants
      .list({
        q: val,
      })
      .then(({ data }) => {
        setSearchResults(data.variants)
      })
  }

  const extractPrice = prices => {
    const reg = regions.find(r => r.id === draftOrder.cart.region_id)
    let price = prices.find(ma => ma.currency_code === reg.currency_code)

    if (price) {
      return (price.amount * (1 + draftOrder.cart.region.tax_rate / 100)) / 100
    }

    return 0
  }

  const handlePayment = async type => {
    setHandlingPayment(true)
    setPaymentType(type)
    try {
      switch (type) {
        case "system": {
          const { data } = await Medusa.draftOrders.registerSystemPayment(id)
          toaster("Payment successfully handled", "success")
          navigate(`/a/orders/${data.order.id}`)
          break
        }
        case "creditcard": {
          break
        }
        case "link": {
          var tempInput = document.createElement("input")
          tempInput.value = store.payment_link_template.replace(
            /\{cart_id\}/,
            draftOrder.cart_id
          )
          document.body.appendChild(tempInput)

          tempInput.select()
          document.execCommand("copy")
          document.body.removeChild(tempInput)
          toaster("Link copied to clipboard", "success")
          break
        }
        default:
          break
      }
      setHandlingPayment(false)
    } catch (error) {
      setHandlingPayment(false)
      toaster("Failed to handle payment", "error")
    }
  }

  if (isLoading) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  return (
    <Flex flexDirection="column" mb={5} py={5}>
      <Flex flexDirection="column" mb={2}>
        <Card mb={4}>
          <Card.Header
            action={
              draftOrder.status === "open"
                ? {
                    type: "danger",
                    label: "Delete",
                    isLoading: deletingOrder,
                    onClick: () => handleDeleteOrder(),
                  }
                : draftOrder.status === "completed"
                ? {
                    type: "cta",
                    label: "Go to order",
                    onClick: () => navigate(`/a/orders/${draftOrder.order_id}`),
                  }
                : undefined
            }
          >
            <Flex alignItems="center">
              <Text mr={3}>Draft order</Text>
              <Flex
                onClick={() => handleCopyToClip(draftOrder.display_id)}
                sx={{ cursor: "pointer" }}
                data-for={"order-display_id"}
                data-tip={"Click to copy"}
              >
                <ReactTooltip
                  id={"order-display_id"}
                  place="top"
                  effect="solid"
                />
                <Box>#{draftOrder.display_id}</Box>
                <Box ml={1}>
                  <Clipboard
                    style={{
                      ":hover": { fill: "#454545" },
                    }}
                    fill={"#848484"}
                    width="8"
                    height="8"
                  />
                </Box>
              </Flex>
              <Badge
                ml={3}
                color={decideBadgeColor(draftOrder.status).color}
                bg={decideBadgeColor(draftOrder.status).bgColor}
              >
                {draftOrder.status}
              </Badge>
            </Flex>
          </Card.Header>
          <Box>
            <Text p={3} fontWeight="bold">
              {(draftOrder.cart.total / 100).toFixed(2)}{" "}
              {draftOrder.cart.region.currency_code.toUpperCase()}
            </Text>
          </Box>
          <Card.Body>
            <Box pl={3} pr={2}>
              <Text pb={1} color="gray">
                Date
              </Text>
              <Text>
                {moment(draftOrder.created_at).format("MMMM Do YYYY, h:mm:ss")}
              </Text>
            </Box>
            <Card.VerticalDivider mx={3} />
            <Box pl={3} pr={2}>
              <Text pb={1} color="gray">
                Email
              </Text>
              <Text>{draftOrder.cart?.email}</Text>
            </Box>
            <Card.VerticalDivider mx={3} />
            <Box pl={3} pr={2}>
              <Text pb={1} color="gray">
                Phone
              </Text>
              <Text>
                {draftOrder?.cart?.shipping_address?.phone
                  ? draftOrder.cart.shipping_address.phone
                  : "N / A"}
              </Text>
            </Box>
          </Card.Body>
        </Card>
      </Flex>
      {/* Line items */}
      <Card mb={4}>
        <Card.Header
        // action={{
        //   type: "primary",
        //   label: "+ Add item",
        //   disabled: draftOrder.status !== "open",
        //   onClick: () => console.log("hello"),
        // }}
        >
          Items
        </Card.Header>
        <Card.Body flexDirection="column">
          {draftOrder.cart.items.map((lineItem, i) => {
            const {
              tax_rate: taxRate,
              currency_code: currency,
            } = draftOrder.cart.region
            return (
              <Flex pl={3} alignItems="center" key={i} py={2}>
                <Flex pr={3}>
                  <Box alignSelf={"center"} minWidth={"35px"}>
                    {lineItem.quantity} x
                  </Box>
                  <Box mx={2}>
                    <Flex width="30px" height="30px">
                      <LineItemImage
                        src={lineItem.thumbnail || ImagePlaceholder}
                        p={!lineItem.thumbnail && "8px"}
                      />
                    </Flex>
                  </Box>
                  <Box>
                    <LineItemLabel
                      ml={2}
                      mr={5}
                      onClick={() => navigate(`/a/products/${productId}`)}
                    >
                      {lineItem.title}
                      {lineItem.variant?.sku && (
                        <>
                          <br /> {lineItem.variant.sku}
                        </>
                      )}
                      <br />
                      {(1 + taxRate / 100) * (lineItem.unit_price / 100)}{" "}
                      {currency}
                    </LineItemLabel>
                  </Box>
                </Flex>
              </Flex>
            )
          })}
        </Card.Body>
      </Card>
      {/* CUSTOMER */}
      <CustomerInformation
        order={draftOrder.cart}
        updateOrder={update}
        show={showEditCustomer}
        canEdit={draftOrder.status === "open"}
        setShow={setShowEditCustomer}
        toaster={toaster}
      />
      {/* PAYMENT */}
      <Flex flexDirection="column" mb={2}>
        <Card mb={4}>
          <Card.Header>
            <Flex alignItems="center">
              <Text mr={3}>Payment</Text>
              <Badge
                color={decideBadgeColor(draftOrder.status).color}
                bg={decideBadgeColor(draftOrder.status).bgColor}
              >
                {draftOrder.status}
              </Badge>
            </Flex>
          </Card.Header>
          <Card.Body flexDirection="column">
            <Flex>
              <Box flex={"0 20%"} pl={3} pr={5}>
                <Text color="gray">Subtotal</Text>
                <Text pt={1} color="gray">
                  Shipping
                </Text>
                {draftOrder.cart.discount_total > 0 && (
                  <Text pt={1} color="gray">
                    Discount
                  </Text>
                )}
                <Text pt={1} color="gray">
                  Total
                </Text>
                <Text pt={1} color="gray" fontSize={0} fontStyle={"italic"}>
                  Tax Amount
                </Text>
              </Box>
              <Box px={3}>
                <Text>
                  <AlignedDecimal
                    currency={draftOrder.cart.region.currency_code}
                    value={
                      draftOrder.cart.subtotal *
                      (1 + draftOrder.cart.region.tax_rate / 100)
                    }
                  />
                </Text>
                <Text pt={1}>
                  <AlignedDecimal
                    currency={draftOrder.cart.region.currency_code}
                    value={
                      draftOrder.cart.shipping_total *
                      (1 + draftOrder.cart.region.tax_rate / 100)
                    }
                  />
                </Text>
                {draftOrder.cart.discount_total > 0 && (
                  <Text pt={1}>
                    <AlignedDecimal
                      currency={draftOrder.cart.region.currency_code}
                      value={
                        -draftOrder.cart.discount_total *
                        (1 + draftOrder.cart.region.tax_rate / 100)
                      }
                    />
                  </Text>
                )}
                <Text pt={1}>
                  <AlignedDecimal
                    currency={draftOrder.cart.region.currency_code}
                    value={draftOrder.cart.total}
                  />
                </Text>
                <Text pt={1} fontSize={0} fontStyle={"italic"}>
                  <AlignedDecimal
                    currency={draftOrder.cart.region.currency_code}
                    value={draftOrder.cart.tax_total}
                  />
                </Text>
              </Box>
            </Flex>
            {draftOrder.status !== "completed" && (
              <Flex mt={4} pl={3}>
                <Button
                  variant="primary"
                  mr={3}
                  onClick={() => handlePayment("system")}
                  loading={handlingPayment && "system" === paymentType}
                >
                  Mark as paid
                </Button>
                <Button
                  variant="primary"
                  mr={3}
                  onClick={() => handlePayment("link")}
                  loading={handlingPayment && "link" === paymentType}
                  data-for={draftOrder.cart_id}
                  data-tip={store.payment_link_template.replace(
                    /\{cart_id\}/,
                    draftOrder.cart_id
                  )}
                >
                  <ReactTooltip
                    id={draftOrder.cart_id}
                    place="top"
                    effect="solid"
                  />
                  Payment link
                  <Clipboard
                    style={{
                      marginLeft: "5px",
                      ":hover": { fill: "#454545" },
                    }}
                    fill={"#848484"}
                    width="8"
                    height="8"
                  />
                </Button>
              </Flex>
            )}
          </Card.Body>
        </Card>
      </Flex>
      {/* METADATA */}
      <Card mr={3} width="100%">
        <Card.Header>Raw draft order</Card.Header>
        <Card.Body>
          <ReactJson
            name={false}
            collapsed={true}
            src={draftOrder}
            style={{ marginLeft: "20px" }}
          />
        </Card.Body>
      </Card>
      {/* <AddItemModal
        handleAddItem={handleAddItem}
        handleAddQuantity={() => console.log("log")}
        handleProductSearch={handleProductSearch}
        handleRemoveItem={handleRemoveItem}
        handleAddCustom={addCustomItem}
        extractPrice={extractPrice}
        searchResults={searchResults}
        items={items}
        region={draftOrder.cart.region}
        isAddingItem={isAddingItem}
      /> */}
    </Flex>
  )
}

export default DraftOrderDetails
