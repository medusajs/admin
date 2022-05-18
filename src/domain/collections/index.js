import { Router } from "@reach/router"
import { navigate } from "gatsby"
import { useAdminCreateCollection } from "medusa-react"
import qs from "query-string"
import React, { useState } from "react"
import { Box, Flex, Text } from "rebass"
import Button from "../../components/button"
import Spinner from "../../components/spinner"
import {
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
} from "../../components/table"
import CollectionModal from "../../components/templates/collection-modal"
import useMedusa from "../../hooks/use-medusa"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"
import CollectionDetails from "./details"

const CollectionsIndex = () => {
  const [showNew, setShowNew] = useState(false)
  const createCollection = useAdminCreateCollection()
  const notification = useNotification()
  const { collections, isLoading, refresh } = useMedusa("collections", {
    search: `?${qs.stringify(filtersOnLoad)}`,
  })

  const handleAddNew = (data, metadata) => {
    const payload = {
      title: data.title,
      handle: data.handle,
    }

    if (metadata) {
      const payloadMetadata = metadata
        .filter((m) => m.key && m.value)
        .reduce((acc, next) => {
          return {
            ...acc,
            [next.key]: next.value,
          }
        }, {})

      payload.metadata = payloadMetadata
    }

    createCollection.mutate(payload, {
      onSuccess: () => {
        notification("Success", "Collection created", "success")
        refresh()
        setShowNew(false)
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  const filtersOnLoad = qs.parse(window.location.search)

  if (!filtersOnLoad.offset) {
    filtersOnLoad.offset = 0
  }

  if (!filtersOnLoad.limit) {
    filtersOnLoad.limit = 50
  }

  const [offset, setOffset] = useState(0)
  const [limit, setLimit] = useState(50)
  const [query, setQuery] = useState("")

  const handlePagination = (direction) => {
    const updatedOffset = direction === "next" ? offset + limit : offset - limit
    const baseUrl = qs.parseUrl(window.location.href).url

    const prepared = qs.stringify(
      {
        q: query,
        offset: updatedOffset,
        limit,
      },
      { skipNull: true, skipEmptyString: true }
    )

    window.history.pushState(baseUrl, "", `?${prepared}`)

    refresh({ search: `?${prepared}` }).then(() => {
      setOffset(updatedOffset)
    })
  }

  const moreResults = collections && collections.length >= limit

  return (
    <>
      <Flex flexDirection="column" pb={5} pt={5}>
        <Flex>
          <Text fontSize={20} fontWeight="bold" mb={3}>
            Collections
          </Text>
          <Box ml="auto" />
          <Button onClick={() => setShowNew(true)} variant={"cta"}>
            New collection
          </Button>
        </Flex>
        {isLoading ? (
          <Flex
            flexDirection="column"
            alignItems="center"
            height="100vh"
            mt="auto"
          >
            <Box height="75px" width="75px" mt="50%">
              <Spinner dark />
            </Box>
          </Flex>
        ) : (
          <Table>
            <TableHead>
              <TableHeaderRow>
                <TableHeaderCell>Title</TableHeaderCell>
                <TableHeaderCell>Num. products</TableHeaderCell>
              </TableHeaderRow>
            </TableHead>
            <TableBody>
              {collections.map((el, i) => (
                <TableRow
                  key={i}
                  onClick={() => navigate(`/a/collections/${el.id}`)}
                >
                  <TableDataCell>{el.title ? el.title : "-"}</TableDataCell>
                  <TableDataCell>
                    {el.products ? el.products.length : "-"}
                  </TableDataCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Flex mt={2}>
          <Box ml="auto" />
          <Button
            onClick={() => handlePagination("previous")}
            disabled={offset === 0}
            variant={"primary"}
            fontSize="12px"
            height="24px"
            mr={1}
          >
            Previous
          </Button>
          <Button
            onClick={() => handlePagination("next")}
            disabled={!moreResults}
            variant={"primary"}
            fontSize="12px"
            height="24px"
            ml={1}
          >
            Next
          </Button>
        </Flex>
      </Flex>
      {showNew && (
        <CollectionModal
          onClose={() => setShowNew(!showNew)}
          onSubmit={handleAddNew}
        />
      )}
    </>
  )
}

const Collections = () => {
  return (
    <Router className="h-full">
      <CollectionsIndex path="/" />
      <CollectionDetails path=":id" />
    </Router>
  )
}

export default Collections
