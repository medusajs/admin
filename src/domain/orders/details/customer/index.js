import { navigate } from "gatsby"
import { isEmpty } from "lodash"
import React from "react"
import { Box, Text } from "rebass"
import Card from "../../../../components/card"
import { countryLookup } from "../../../../utils/countries"
import CustomerInformationEdit from "./edit"

const formatShippingOrBillingAddress = (shippingOrBillingAddress) => {
  const postalCode = shippingOrBillingAddress.postal_code || ""
  const city = shippingOrBillingAddress.city || ""
  const province = shippingOrBillingAddress.province || ""
  const countryCode = shippingOrBillingAddress.country_code || ""
  const countryName = countryLookup(countryCode)

  const spaceIfProvince = province ? " " : ""
  return `${postalCode} ${city}${spaceIfProvince}${province}, ${countryName}`
}

const CustomerInformation = ({
  order,
  updateOrder,
  setShow,
  show,
  canceled,
  notification,
}) => {
  const actions = []

  if (!canceled) {
    actions.push({
      type: "primary",
      label: "Edit",
      onClick: () => setShow(true),
    })
  }

  return (
    <Card mr={3} mb={4} width="100%">
      <Card.Header dropdownOptions={actions}>Customer</Card.Header>
      <Card.Body>
        <Box px={3}>
          <Text color="gray">Contact</Text>
          <Text
            pt={3}
            sx={{
              cursor: "pointer",
              fontWeight: 500,
              color: "link",
              ":hover": {
                color: "medusa",
              },
            }}
            customerExist={order.customer}
            onClick={() => {
              if (order.customer) {
                navigate(`/a/customers/${order.customer.id}`)
              } else {
                return
              }
            }}
          >
            {order.email}
          </Text>
          <Text pt={2}>
            {order.shipping_address.first_name}{" "}
            {order.shipping_address.last_name}
          </Text>
        </Box>
        <Card.VerticalDivider mx={3} />
        <Box px={3}>
          <Text color="gray">Shipping</Text>
          {!isEmpty(order.shipping_address) ? (
            <>
              <Text pt={3}>{order.shipping_address.address_1}</Text>
              {order.shipping_address.address_2 && (
                <Text pt={2}>{order.shipping_address.address_2}</Text>
              )}
              <Text pt={2}>
                {formatShippingOrBillingAddress(order.shipping_address)}
              </Text>
            </>
          ) : (
            <Text pt={3}>No shipping address</Text>
          )}
        </Box>
        <Card.VerticalDivider mx={3} />
        <Box px={3}>
          <Text color="gray">Billing</Text>
          {!isEmpty(order.billing_address) ? (
            <>
              <Text pt={3}>{order.billing_address.address_1}</Text>
              {order.billing_address.address_2 && (
                <Text pt={2}>{order.billing_address.address_2}</Text>
              )}
              <Text pt={2}>
                {formatShippingOrBillingAddress(order.billing_address)}
              </Text>
            </>
          ) : (
            <Text pt={3}>No billing address</Text>
          )}
        </Box>
      </Card.Body>
      {show && (
        <CustomerInformationEdit
          order={order}
          notification={notification}
          onUpdate={updateOrder}
          customerData={{ email: order.email }}
          shippingData={order.shipping_address}
          onDismiss={() => setShow(false)}
        />
      )}
    </Card>
  )
}

export default CustomerInformation
