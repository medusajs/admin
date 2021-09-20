import React, { useRef, useState } from "react"
import { Text, Flex, Box } from "rebass"
import moment from "moment"

import Button from "../../../../components/button"
import { Input } from "@rebass/forms"
import Dropdown from "../../../../components/dropdown"

import Medusa from "../../../../services/api"

export default ({ event, onUpdateNotes, toaster }) => {
  const [note, setNote] = useState(event?.raw?.value)
  const [edit, setEdit] = useState(false)

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

  const handleSaveEdit = () => {
    setEdit(false)
    Medusa.notes.update(event.id, note).then(() => reload("Note was updated"))
  }

  const handleCancelEdit = () => {
    setNote(event?.raw?.value)
    setEdit(false)
  }

  const user = event.raw.author
  let author = user.first_name ? user.first_name : ""
  author += user.last_name ? user.last_name : ""
  if (!author) author = "unknown"

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
            <Text fontSize={1} color="grey" fontWeight="500">
              Note added <span style={{ fontWeight: 400 }}>by {author}</span>
            </Text>
          </Flex>
          <Text fontSize="11px" color="grey">
            {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
          </Text>
        </Box>
        <Box>
          <br />
          {edit ? (
            <Flex>
              <Flex>
                <Input
                  m={3}
                  ref={noteRef}
                  type="text"
                  name="note"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </Flex>
              <Button
                variant="primary"
                onClick={handleCancelEdit}
                mr={3}
                mt={3}
              >
                Cancel
              </Button>
              <Button variant="cta" onClick={handleSaveEdit} mr={3} mt={3}>
                Save
              </Button>
            </Flex>
          ) : (
            <Text mr={100} fontSize={3} color={"dark"}>
              {note}
            </Text>
          )}
        </Box>
      </Box>
      <Box>
        <Dropdown>
          <Text onClick={() => setEdit(true)}>Edit</Text>
          <Text color="danger" onClick={handleDelete}>
            Delete note
          </Text>
        </Dropdown>
      </Box>
    </Flex>
  )
}
