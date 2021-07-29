import React, { useEffect } from "react"
import { Box, Button, Flex } from "rebass"
import Modal from "../../../../../components/modal"
import useMedusa from "../../../../../hooks/use-medusa"
import useModal from "../../../../../hooks/use-modal"
import NewItemsInformation from "./new-items-information"
import PaymentInformation from "./payment-information"
import ReturnOrderInformation from "./return-order-information"

const SwapDetails = ({
  event,
  swapId,
  order,
  onReceiveReturn,
  onFulfillSwap,
  onProcessPayment,
}) => {
  const { isOpen, handleClose, handleOpen } = useModal()
  const { swap, refresh } = useMedusa("swaps", { id: swapId })
  useEffect(() => {
    if (order) {
      refresh({ id: swapId })
    }
  }, [order])

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
