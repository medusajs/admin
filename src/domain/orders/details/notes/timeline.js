import React, { useRef, useState } from "react"
import { Text, Flex, Box } from "rebass"
import moment from "moment"

import Button from "../../../../components/button"
import { Input } from "@rebass/forms"
import Dropdown from "../../../../components/dropdown"
import TextArea from "../../../../components/textarea"

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

  let author = "unknown"
  if (user) {
    if (user.first_name) {
      author = [user.first_name, user.last_name].filter(Boolean).join(" ")
    } else {
      author = user.email
    }
  }

  return (
    <Box
      pb={3}
      mb={3}
      sx={{
        width: "100%",
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
      <Box mx={3}>
        <Flex mb={2}>
          <Text fontSize={1} color="grey" fontWeight="500">
            Note added <span style={{ fontWeight: 400 }}>by {author}</span>
          </Text>
        </Flex>
        <Text fontSize="11px" color="grey">
          {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
        </Text>
      </Box>
      <Flex
        sx={{
          mt: 3,
          mx: 3,
          w: 1,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ flex: 1, mr: 4 }}>
          {edit ? (
            <Flex sx={{ flexDirection: "column" }}>
              <TextArea
                resize="vertical"
                my={3}
                ref={noteRef}
                type="text"
                name="note"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
              <Flex>
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
            </Flex>
          ) : (
            <Text sx={{ whiteSpace: "pre-wrap" }} fontSize={2} color={"dark"}>
              {note}
            </Text>
          )}
        </Box>
        <Dropdown sx={{ height: "25px" }}>
          <Text onClick={() => setEdit(true)}>Edit</Text>
          <Text color="danger" onClick={handleDelete}>
            Delete note
          </Text>
        </Dropdown>
      </Flex>
    </Box>
  )
}
