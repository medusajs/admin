import React, { useRef, useState } from "react"
import { Text, Flex, Box } from "rebass"
import moment from "moment"

import Button from "../../../../components/button"
import EditableInput from "../../../../components/editable-input"
import { Input } from "@rebass/forms"

import Medusa from "../../../../services/api"

export default ({ event, onUpdateNotes, toaster }) => {
  const [note, setNote] = useState(event?.raw?.value)

  const noteRef = useRef()

  const reload = async updateMessage => {
    Medusa.notes
      .listByResource(event.raw.resource_id)
      .then(response => {
        onUpdateNotes(response.data.notes)
      })
      .then(() => toaster(updateMessage, "success"))
  }

  const handleDelete = () => {
    Medusa.notes.delete(event.id).then(() => reload("Note was deleted"))
  }

  const onTitleBlur = () => {
    if (event.raw.value === note) return

    Medusa.notes.update(event.id, note).then(() => reload("Note was updated"))
  }

  return (
    <Flex
      alignItems="center"
      sx={{
        ".rsnd-btn": {
          display: "none",
        },
        ":hover": {
          ".rsnd-btn": {
            display: "inline-block",
          },
        },
      }}
    >
      <Box width={"100%"} sx={{ borderBottom: "hairline" }} mb={3} pb={3}>
        <Flex px={3} width={"100%"} justifyContent="space-between">
          <Box>
            <Flex mb={2}>
              <Text mr={100} fontSize={1} color="grey" fontWeight="500">
                <EditableInput
                  text={note}
                  childRef={noteRef}
                  type="input"
                  style={{ maxWidth: "400px" }}
                  onBlur={onTitleBlur}
                >
                  <Input
                    m={3}
                    ref={noteRef}
                    type="text"
                    name="note"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                  />
                </EditableInput>
              </Text>
            </Flex>
            <Text fontSize="11px" color="grey">
              {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
            </Text>
          </Box>
          <Button className="rsnd-btn" variant="primary" onClick={handleDelete}>
            Delete
          </Button>
        </Flex>
      </Box>
    </Flex>
  )
}
