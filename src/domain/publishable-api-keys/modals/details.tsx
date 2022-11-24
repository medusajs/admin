import React, { PropsWithChildren, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import Button from "../../../components/fundamentals/button"
import InputField from "../../../components/molecules/input"

type SideModalProps = PropsWithChildren<{
  close: () => void
  isVisible: boolean
}>

/**
 * TODO: extract as a component
 */
function SideModal(props: SideModalProps) {
  return (
    <AnimatePresence>
      {props.isVisible && (
        <>
          <motion.div
            onClick={props.close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 99,
              background: "rgba(0,0,0,.3)",
            }}
          ></motion.div>
          <motion.div
            initial={{ right: -560 }}
            style={{
              position: "fixed",
              height: "100%",
              width: 560,
              background: "white",
              right: 0,
              top: 0,
              zIndex: 9999,
            }}
            className="rounded border "
            animate={{ right: 0 }}
            exit={{ right: -560 }}
          >
            {props.children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

type DetailsModalProps = {
  close: () => void
  isVisible: boolean
  name: string
}

/**
 * Publishable Key details container.
 */
function DetailsModal(props: DetailsModalProps) {
  const [name, setName] = useState(props.name)
  return (
    <SideModal close={props.close} isVisible={props.isVisible}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="inter-large-semibold text-xl text-gray-900">
            Edit API key details
          </h3>
          <Button variant="ghost" onClick={props.close}>
            <CrossIcon size={20} className="text-grey-40" />
          </Button>
        </div>
        <div className="h-[1px] bg-gray-200" style={{ margin: "24px -24px" }} />
        <div>
          <InputField
            label="Title"
            type="string"
            name="name"
            value={name}
            placeholder="Name your key"
            onChange={(ev) => setName(ev.target.value)}
          />
        </div>
      </div>
    </SideModal>
  )
}

export default DetailsModal
