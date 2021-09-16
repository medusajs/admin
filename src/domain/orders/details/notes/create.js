import React, { useRef, useState } from "react"
import { Text, Flex, Box } from "rebass"
import moment from "moment"

import Button from "../../../../components/button"
import EditableInput from "../../../../components/editable-input"
import { Input } from "@rebass/forms"

import Medusa from "../../../../services/api"

export default ({ order, onUpdateNotes, toaster }) => {
  const [note, setNote] = useState("")

  const handleCreate = event => {
    if (event.key === "Enter") {
      Medusa.notes
        .create(order.id, "order", note)
        .then(() => {
          Medusa.notes.listByResource(order.id).then(response => {
            onUpdateNotes(response.data.notes)
          })
        })
        .then(() => {
          toaster("created note", "success")
          setNote("")
        })
    }
  }

  return (
    <Flex>
      <Input
        placeholder="Add note"
        m={3}
        value={note}
        onChange={e => setNote(e.target.value)}
        onKeyPress={handleCreate}
      />
    </Flex>
  )
}
