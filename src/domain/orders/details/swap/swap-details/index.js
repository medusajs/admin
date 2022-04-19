import React, { useEffect } from "react"
import { Box, Button, Flex } from "rebass"
import Modal from "../../../../../components/modal"
import useMedusa from "../../../../../hooks/use-medusa"
import NewItemsInformation from "./new-items"
import PaymentInformation from "./payment-information"
import ReturnOrderInformation from "./return-items"
import { ReactComponent as CloseIcon } from "../../../../../assets/svg/cross.svg"
import useToggleState from "../../../../../hooks/use-toggle-state"

const SwapDetails = ({
  event,
  swapId,
  order,
  onReceiveReturn,
  paymentLink,
  onFulfillSwap,
  onProcessPayment,
}) => {
  const { state: isOpen, open, close } = useToggleState()
  const { swap, refresh } = useMedusa("swaps", { id: swapId })
  useEffect(() => {
    if (order) {
      refresh({ id: swapId })
    }
  }, [order])

  return (
    <>
      <Button onClick={open} variant="primary">
        Swap details
      </Button>
      {isOpen && (
        <Modal onClick={close}>
          <Modal.Body>
            <Modal.Header
              justifyContent="space-between"
              alignItems="center"
              p={3}
              fontSize={18}
              fontWeight={500}
            >
              Swap Details
              <CloseIcon
                style={{ cursor: "pointer" }}
                onClick={close}
                width={12}
                height={12}
              />
            </Modal.Header>
            <Modal.Content flexDirection="column">
              <Flex mb={3} flexDirection="column">
                <Box>
                  <ReturnOrderInformation
                    event={event}
                    swap={swap}
                    onReceiveReturn={onReceiveReturn}
                    order={order}
                  />
                </Box>
                <Box mt={5}>
                  <NewItemsInformation
                    event={event}
                    order={order}
                    onFulfillSwap={onFulfillSwap}
                  />
                </Box>
                <Box mt={5} flexDirection="column">
                  <PaymentInformation
                    event={event}
                    order={order}
                    swap={swap}
                    onProcessPayment={onProcessPayment}
                    paymentLink={paymentLink}
                  />
                </Box>
              </Flex>
            </Modal.Content>
          </Modal.Body>
        </Modal>
      )}
    </>
  )
}

export default SwapDetails
