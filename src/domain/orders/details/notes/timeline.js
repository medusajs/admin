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
      justifyContent="space-between"
      sx={{
        borderBottom: "hairline",
        ".delete-btn": {
          display: "none",
        },
        ":hover": {
          ".delete-btn": {
            display: "inline-block",
          },
        },
      }}
    >
      <Box pb={3} mt={3} mb={3} px={3}>
        <Box>
          <Flex mb={2}>
            <Text mr={100} fontSize={1} color="grey" fontWeight="500">
              Note added
            </Text>
          </Flex>
          <Text fontSize="11px" color="grey">
            {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
          </Text>
        </Box>
        <Box>
          <Text mr={100} fontSize={1} color="grey">
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
        </Box>
      </Box>
      <Box>
        <Button
          mt={3}
          className="delete-btn"
          variant="primary"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Box>
    </Flex>
  )
}
