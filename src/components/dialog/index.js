import React, { useState } from "react"
import Modal from "../modal"
import Button from "../button"

const Dialog = ({
  title,
  submitLoading,
  onSubmit,
  onCancel,
  submitText,
  cancelText,
  children,
}) => {
  return (
    <Modal onClick={onCancel}>
      <Modal.Body>
        <Modal.Header>{title}</Modal.Header>
        <Modal.Content>{children}</Modal.Content>
        <Modal.Footer justifyContent="flex-end">
          <Button mr={2} variant="primary" onClick={onCancel}>
            {cancelText || "Cancel"}
          </Button>
          <Button variant="green" loading={submitLoading} onClick={onSubmit}>
            {submitText || "Submit"}
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default Dialog
