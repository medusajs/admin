import { isEmpty } from "lodash"
import React, { useMemo, useCallback } from "react"
import ReactTooltip from "react-tooltip"
import { Box, Button, Flex, Text } from "rebass"
import { ReactComponent as Clipboard } from "../../../../assets/svg/clipboard.svg"
import Badge from "../../../../components/badge"
import Divider from "../../../../components/divider"
import Modal from "../../../../components/modal"
import useMedusa from "../../../../hooks/use-medusa"
import useModal from "../../../../hooks/use-modal"
import { decideBadgeColor } from "../../../../utils/decide-badge-color"
import { formatAddress } from "../../../../utils/format-address"
import { computeShippingTotal, computeSubtotal } from "../../../../utils/totals"
import LineItem from "./line-item"

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

const SwapShippingMethod = ({ swap, taxRate, currency }) => {
  return (
    <>
      <Text fontSize={12} mb={2} fontWeight={500}>
        Return Method(s)
      </Text>
      {swap?.shipping_methods?.length ? (
        swap.shipping_methods.map(method => (
          <Box key={method._id} mt={3}>
            <Box>
              <Text fontSize={12} color="#454B54">
                {method.shipping_option ? (
                  <>
                    {method.shipping_option.name} -{" "}
                    {((100 + taxRate) * method.shipping_option.amount) / 10000}{" "}
                    {currency.toUpperCase()}
                  </>
                ) : (
                  <span style={{ fontStyle: "italic" }}>
                    Order was shipped with a now deleted option
                  </span>
                )}
              </Text>
            </Box>
          </Box>
        ))
      ) : (
        <Text fontSize={12} fontStyle="italic" color="#454B54">
          No shipping for this order
        </Text>
      )}
    </>
  )
}

const SwapShippingInformation = ({ swap }) => {
  return (
    <Box>
      <Text fontSize={12} fontWeight={500} mb={2}>
        Shipping Address
      </Text>
      {!isEmpty(swap.shipping_address) ? (
        <Box fontSize={12}>
          <Text>{swap.shipping_address.address_1}</Text>
          {swap.shipping_address.address_2 && (
            <Text pt={2}>{swap.shipping_address.address_2}</Text>
          )}
          <Text pt={2}>{formatAddress(swap.shipping_address)}</Text>
        </Box>
      ) : (
        <Text fontSize={12}>No shipping address</Text>
      )}
    </Box>
  )
}

const SwapPayment = ({ order, swap }) => {
  const returnShippingTotal = computeShippingTotal(
    swap.return_order.shipping_methods
  )
  const newShippingTotal = computeShippingTotal(swap.shipping_methods)
  const newItemsTotal = computeSubtotal(swap.additional_items)

  return (
    <>
      <Flex>
        <Box flex="1" pr={5}>
          <Text color="gray">Return total</Text>
          <Text pt={1} color="gray">
            Return shipping
          </Text>
          <Text pt={1} color="gray">
            Total for new items
          </Text>
          <Text pt={1} color="gray">
            Shipping
          </Text>
        </Box>
        <Box px={3}>
          <Text>
            <AlignedDecimal
              currency={order.currency_code}
              value={
                -swap.return_order.refund_amount * (1 + order.tax_rate / 100)
              }
            />
          </Text>
          <Text pt={1}>
            <AlignedDecimal
              currency={order.currency_code}
              value={returnShippingTotal * (1 + order.tax_rate / 100)}
            />
          </Text>
          <Text pt={1}>
            <AlignedDecimal
              currency={order.currency_code}
              value={newItemsTotal * (1 + order.tax_rate / 100)}
            />
          </Text>
          <Text pt={1}>
            <AlignedDecimal
              currency={order.currency_code}
              value={newShippingTotal * (1 + order.tax_rate / 100)}
            />
          </Text>
        </Box>
      </Flex>
      <Box>
        <Divider my={2} />
        <Flex>
          <Box flex="1" pr={5}>
            <Text color="gray">Difference</Text>
          </Box>
          <Box px={3}>
            <Text>
              <AlignedDecimal
                currency={order.currency_code}
                value={swap.difference_due}
              />
            </Text>
          </Box>
        </Flex>
      </Box>
      <Box mt={3}>
        {swap.payment ? `Processed through ${swap.payment.provider_id}` : ""}
      </Box>
    </>
  )
}

const useClipboard = (text, { onCopied = () => {} }) => {
  const handleCopy = useCallback(() => {
    var tempInput = document.createElement("input")
    tempInput.value = text
    document.body.appendChild(tempInput)
    tempInput.select()
    document.execCommand("copy")
    document.body.removeChild(tempInput)
    onCopied()
  }, [text, onCopied])

  return [handleCopy]
}

const SwapDetails = ({ event, order, onReceiveReturn }) => {
  const { isOpen, handleClose, handleOpen } = useModal()
  const { store, toaster } = useMedusa("store")

  const payment_link = useMemo(() => {
    if (!store) return ""

    return store.payment_link_template.replace(/\{cart_id\}/, event.raw.cart_id)
  }, [store])
  const [handleCopyToClipboard] = useClipboard(payment_link, {
    onCopied: () => {
      toaster("Link copied to clipboard", "success")
    },
  })

  const returnStatusColors = decideBadgeColor(
    event.raw.return_order && event.raw.return_order.status
  )
  const newStatusColors = decideBadgeColor(order.status)
  const paymentStatusColors = decideBadgeColor(event.raw.payment_status)

  return (
    <>
      <Button onClick={handleOpen} mr={3} variant="primary">
        Swap details
      </Button>
      {isOpen && (
        <Modal onClick={handleClose}>
          <Modal.Body>
            <Modal.Header p={3} fontSize={18} fontWeight={500}>
              Swap Details
            </Modal.Header>
            <Modal.Content flexDirection="column">
              <Flex mb={3} flexDirection="column">
                <Box>
                  <Flex mb={3} alignItems="center">
                    <Text mr={3} fontWeight={500}>
                      Return items
                    </Text>
                    <Badge
                      color={returnStatusColors.color}
                      bg={returnStatusColors.bgColor}
                    >
                      {event.raw.return_order.status}
                    </Badge>
                  </Flex>
                  {event.return_lines.map((lineItem, i) => (
                    <LineItem
                      key={lineItem.id}
                      currency={order.currency_code}
                      lineItem={lineItem}
                      taxRate={order.tax_rate}
                      onReceiveReturn={onReceiveReturn}
                      rawEvent={event.raw}
                    />
                  ))}
                  <Box mt={3}>
                    <SwapShippingMethod
                      swap={event.raw}
                      currency={order.currency_code}
                      taxRate={order.tax_rate}
                    />
                  </Box>
                </Box>
                <Flex mt={5}>
                  <Box>
                    <Flex mb={3} alignItems="center">
                      <Text mr={3} fontWeight={500}>
                        New items
                      </Text>
                      <Badge
                        color={newStatusColors.color}
                        bg={newStatusColors.bgColor}
                      >
                        {order.status}
                      </Badge>
                    </Flex>
                    {event.items.map(lineItem => (
                      <LineItem
                        key={lineItem.id}
                        currency={order.currency_code}
                        lineItem={lineItem}
                        taxRate={order.tax_rate}
                        onReceiveReturn={onReceiveReturn}
                        rawEvent={event.raw}
                      />
                    ))}
                    <Box mt={3}>
                      <SwapShippingInformation swap={event.raw} />
                    </Box>
                    <Box mt={3}>
                      <SwapShippingMethod
                        swap={event.raw}
                        currency={order.currency_code}
                        taxRate={order.tax_rate}
                      />
                    </Box>
                  </Box>
                </Flex>
                <Flex mt={5} flexDirection="column">
                  <Flex mb={3} alignItems="center">
                    <Text mr={3} fontWeight={500}>
                      Payment
                    </Text>

                    <Badge
                      color={paymentStatusColors.color}
                      bg={paymentStatusColors.bgColor}
                    >
                      {event.raw.payment_status}
                    </Badge>
                  </Flex>
                  <Box mb={2}>
                    <Flex alignItems="center" variant="primary">
                      <Box data-for={event.raw.cart_id} data-tip={payment_link}>
                        <Text
                          onClick={handleCopyToClipboard}
                          fontSize={10}
                          sx={{
                            cursor: "pointer",
                            ":hover": { textDecoration: "underline" },
                          }}
                        >
                          <ReactTooltip
                            id={event.raw.cart_id}
                            place="top"
                            effect="solid"
                          />
                          Copy payment link
                        </Text>
                      </Box>
                      <Clipboard
                        style={{
                          marginLeft: "5px",
                          ":hover": { fill: "#454545" },
                        }}
                        fill={"#848484"}
                        width="10"
                        height="10"
                      />
                    </Flex>
                  </Box>
                  <Box>
                    <SwapPayment order={order} swap={event.raw} />
                  </Box>
                </Flex>
              </Flex>
            </Modal.Content>
          </Modal.Body>
        </Modal>
      )}
    </>
  )
}

export default SwapDetails
