import React, { useState } from "react"
import { Text, Flex, Box, Image } from "rebass"
import styled from "@emotion/styled"
import moment from "moment"

import Typography from "../../../../components/typography"
import Button from "../../../../components/button"

import { ReactComponent as Silent} from "../../../../assets/svg/silent.svg"
import { ReactComponent as Notification} from "../../../../assets/svg/notification.svg"

const LineItemLabel = styled(Text)`
  ${Typography.Base};

  cursor: pointer;

  font-size: 10px;
`

const LineItem = ({ lineItem, currency, taxRate }) => {
  const productId = lineItem.variant.product_id

  return (
    <Flex alignItems="center">
      <Flex flex={1} alignItems="center">
        <Box alignSelf={"center"} minWidth={"35px"}>
          {lineItem.quantity} x
        </Box>
        <Box mx={2}>
          <Image
            src={lineItem.thumbnail || ""}
            sx={{
              objectFit: "contain",
              objectPosition: "center",
              width: 35,
              height: 35,
            }}
          />
        </Box>
        <Box>
          <LineItemLabel
            ml={2}
            mr={5}
            onClick={() => navigate(`/a/products/${productId}`)}
          >
            {lineItem.title}
            <br /> {lineItem.variant.sku}
            <br />
            {((1 + taxRate / 100) * lineItem.unit_price) / 100}{" "}
            {currency.toUpperCase()}
          </LineItemLabel>
        </Box>
      </Flex>
    </Flex>
  )
}

export default ({ event, order, onReceiveReturn }) => {
  return (
    <Box sx={{ borderBottom: "hairline" }} pb={3} mb={3} px={3}>
      <Text fontSize={1} color="grey" fontWeight="500">
        Return {event.status}
      </Text>
      <Text fontSize="11px" color="grey" mb={3}>
        {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
      </Text>
      {(event.no_notification | false) !== (order.no_notification | false)   &&  (
              <Flex mt={15}> 
                { event.no_notification ? (
                  <Box pl={10} width={40} height={10}>
                    <Silent viewBox="10 0 200 160" />
                  </Box>
                ) : (
                  <Box pl={10} width={50} height={10}>
                    <Notification viewBox="0 0 160 150" />
                  </Box>    
                )}
              <Box mt={2} pr={2}> 
                <Text color="gray"> 
                  Notifications related to this return are 
                  { event.no_notification ? " disabled" : " enabled" }
                  .
                </Text>
                </Box>
              </Flex>
      )}
      <br/>   
      <Flex justifyContent="space-between">
        <Box>
          {event.items.map(lineItem => (
            <LineItem
              key={lineItem._id}
              currency={order.currency_code}
              lineItem={lineItem}
              taxRate={order.region.tax_rate}
              onReceiveReturn={onReceiveReturn}
              rawEvent={event.raw}
            />
          ))}
        </Box>
        {event.raw.status !== "received" && (
          <Flex>
            <Button
              onClick={() => onReceiveReturn(event.raw)}
              variant={"primary"}
            >
              Receive return
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  )
}
