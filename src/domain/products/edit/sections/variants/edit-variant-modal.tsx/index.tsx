import { Product } from "@medusajs/medusa"
import React from "react"
import Modal from "../../../../../../components/molecules/modal"

type Props = {
  open: boolean
  onClose: () => void
  product: Product
  variantId: string
}

const EditVariantModal = ({ open, onClose, product, variantId }: Props) => {
  return <Modal open={open} handleClose={onClose}></Modal>
}
