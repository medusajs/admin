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
import Button from "../../../components/button"
import ItemModal from "./components/item-modal"
import { displayUnitPrice } from "../../../utils/prices"

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

const DraftOrderDetails = ({ id }) => {
  const [showEditCustomer, setShowEditCustomer] = useState(false)
  const [deletingOrder, setDeletingOrder] = useState(false)
  const [handlingPayment, setHandlingPayment] = useState(false)
  const [paymentType, setPaymentType] = useState("")
  const [deletingItem, setDeletingItem] = useState(false)

  const [editedItem, setEditedItem] = useState()
  const [newItem, setNewItem] = useState()

  const { store } = useMedusa("store")
  const {
    draft_order: draftOrder,
    update,
    isLoading,
    toaster,
    refresh,
  } = useMedusa("draftOrders", {
    id,
  })

  const handleDeleteItem = async itemId => {
    setDeletingItem(itemId)
    await Medusa.draftOrders.deleteLineItem(id, itemId)
    refresh({ id })
    setDeletingItem(null)
  }

  const handleDeleteOrder = async () => {
    setDeletingOrder(true)
    await Medusa.draftOrders
      .delete(id)
      .then(() => {
        navigate("/a/draft-orders")
        setDeletingOrder(false)
      })
      .catch(() => setDeletingOrder(false))
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
          {draftOrder.no_notification_order && (
            <Box pt={2} pr={2}> 
              <Text color="gray"> 
                Notifications for this draft order are disabled.
              </Text>
              </Box>
            )} 
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
          action={
            draftOrder.status === "open" && {
              type: "primary",
              label: "Add item",
              onClick: () => setNewItem(true),
            }
          }
        >
          Items
        </Card.Header>
        <Card.Body flexDirection="column">
          {draftOrder.cart.items.map((lineItem, i) => {
            const { tax_rate: taxRate } = draftOrder.cart.region
            return (
              <Flex
                pl={3}
                alignItems="center"
                key={i}
                py={2}
                sx={{
                  [`.delete-item-button-${i}`]: {
                    display: "none",
                    fontSize: "10px",
                    minHeight: "25px",
                    width: "65px",
                  },
                  ":hover": {
                    [`.delete-item-button-${i}`]: {
                      display: "inline-block",
                    },
                  },
                }}
              >
                <Flex pr={3} sx={{ minWidth: "350px" }}>
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
                    <LineItemLabel ml={2} mr={5}>
                      {lineItem.title} <br />
                      {lineItem.variant?.sku && lineItem.variant.sku}
                      <br />
                      {displayUnitPrice(lineItem, draftOrder.cart.region)}
                    </LineItemLabel>
                  </Box>
                </Flex>
                {draftOrder.status === "open" && (
                  <Button
                    variant="danger"
                    loading={deletingItem === lineItem.id}
                    className={`delete-item-button-${i}`}
                    onClick={() => handleDeleteItem(lineItem.id)}
                  >
                    Delete
                  </Button>
                )}
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
      <Card mb={4}>
        <Card.Header>Shipping</Card.Header>
        <Card.Body flexDirection="column">
          <Flex flexDirection="column" pb={3}>
            {draftOrder.cart?.shipping_methods?.length
              ? draftOrder.cart.shipping_methods.map(method => (
                  <Box key={method._id}>
                    <Box pl={3} pr={2}>
                      <Text pb={1} color="gray">
                        Shipping Method
                      </Text>
                      <Text>{method.shipping_option.name}</Text>
                      <Text pt={3} pb={1} color="gray">
                        Data
                      </Text>
                      <ReactJson
                        name={false}
                        collapsed={true}
                        src={method.data}
                      />
                    </Box>
                    <Card.VerticalDivider mx={3} />
                  </Box>
                ))
              : null}
          </Flex>
        </Card.Body>
      </Card>
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
      {newItem && (
        <ItemModal
          draftOrderId={draftOrder.id}
          region={draftOrder.cart.region}
          refresh={refresh}
          dismiss={() => setNewItem(false)}
        />
      )}
    </Flex>
  )
}

export default DraftOrderDetails
