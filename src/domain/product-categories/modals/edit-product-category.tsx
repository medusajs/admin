import React, { useRef, useState } from "react"
import { useAdminSalesChannels } from "medusa-react"
import { SalesChannel } from "@medusajs/medusa"

import SideModal from "../../../components/molecules/modal/side-modal"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"

type EditProductCategoriesSideModalProps = {
  close: () => void
  isVisible: boolean
}

/**
 * Modal for editing product categories
 */
function EditProductCategoriesSideModal(
  props: EditProductCategoriesSideModalProps
) {
  const { isVisible, close } = props

  const onSave = () => {
    close()
  }

  const onClose = () => {
    close()
  }

  return (
    <SideModal close={onClose} isVisible={!!isVisible}>
      <div className="flex flex-col justify-between h-full p-6">
        {/* === HEADER === */}

        <div className="flex items-center justify-between">
          <h3 className="inter-large-semibold text-xl text-gray-900 flex items-center gap-2">
            Edit product category
          </h3>
          <Button
            variant="secondary"
            className="w-8 h-8 p-2"
            onClick={props.close}
          >
            <CrossIcon size={20} className="text-grey-50" />
          </Button>
        </div>
        {/* === DIVIDER === */}

        <div className="flex-grow">
          <div className="my-6"></div>
        </div>
        {/* === DIVIDER === */}

        <div
          className="h-[1px] bg-gray-200 block"
          style={{ margin: "24px -24px" }}
        />
        {/* === FOOTER === */}

        <div className="flex justify-end gap-2">
          <Button size="small" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={onSave}
            // disabled={}
          >
            Save and close
          </Button>
        </div>
      </div>
    </SideModal>
  )
}

export default EditProductCategoriesSideModal
