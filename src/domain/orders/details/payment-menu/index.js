import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { Radio } from "@rebass/forms"
import { useForm, useFieldArray } from "react-hook-form"

import Modal from "../../../../components/modal"
import Input from "../../../../components/input"
import Button from "../../../../components/button"

import Medusa from "../../../../services/api"

const PaymentMenu = ({ order, onDismiss, onSubmit }) => {
  return (
    <Modal onClick={onDismiss}>
      <Modal.Body width={"600px"} as="form" onSubmit={onSubmit}>
        <Modal.Header>System payment notice</Modal.Header>
        <Modal.Content flexDirection="column">
          <Flex my={3} flexDirection="column">
            <Flex mb={3}>
              <Text
                fontSize={1}
                fontStyle="italic"
                width="100%"
                textAlign="center"
              >
                One or more of your payments is a system payment. Be aware, that
                captures and refunds are not handled by Medusa for such
                payments.
              </Text>
            </Flex>
          </Flex>
        </Modal.Content>
        <Modal.Footer justifyContent="space-between">
          <Button variant="primary" onClick={onDismiss}>
            Cancel
          </Button>
          <Button variant="cta" onClick={onSubmit} type="submit">
            Continue
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default PaymentMenu
