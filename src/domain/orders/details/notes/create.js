import React, { useRef, useState } from "react"
import { Text, Flex, Box } from "rebass"
import moment from "moment"

import Button from "../../../../components/button"
import EditableInput from "../../../../components/editable-input"
import { Input } from "@rebass/forms"

import Medusa from "../../../../services/api"

export default ({ order, toaster }) => {
  const [note, setNote] = useState("")

  const handleCreate = () => {
    Medusa.notes.create(order.id, "order", note).then(() => {
      toaster("created note", "success")
    })
  }

  return (
    <Flex>
      <Input m={3} value={note} onChange={e => setNote(e.target.value)} />
      <Button onClick={handleCreate} />
    </Flex>
  )
}
