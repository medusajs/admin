import React, { useState, useEffect } from "react"
import { Flex, Text, Box } from "rebass"
import { navigate } from "gatsby"

import useMedusa from "../../../hooks/use-medusa"
import Card from "../../../components/card"
import Button from "../../../components/button"
import Spinner from "../../../components/spinner"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import ReturnReasonsList from "./return-reasons-list"

const ReturnReasons = () => {
  const { return_reasons, isLoading } = useMedusa("returnReasons")
  const parent_return_reasons = !isLoading
    ? return_reasons.filter(rr => !rr.parent_return_reason_id)
    : []

  const pageLength = 30
  const [numberOfPages, setNumberOfPages] = useState(
    Math.ceil(parent_return_reasons.length / pageLength)
  )
  // const [startIndex, setStartIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [showReasons, setShownReasons] = useState(
    parent_return_reasons.slice(0, pageLength)
  )

  useEffect(() => {
    if (!isLoading) {
      const startIndex = currentPage * pageLength
      setNumberOfPages(Math.ceil(parent_return_reasons.length / pageLength))
      setShownReasons(
        parent_return_reasons.slice(startIndex, startIndex + pageLength)
      )
    }
  }, [currentPage, isLoading])

  const onPreviousClick = () => {
    setCurrentPage(currentPage - 1)
  }

  const onNextClick = () => {
    setCurrentPage(currentPage + 1)
  }

  const pagination = (
    <Flex>
      {[...Array(numberOfPages).keys()].map(i => {
        const displayPage = i + 1
        return (
          <Text
            sx={{ cursor: "pointer" }}
            mr={2}
            fontWeight={i === currentPage ? "bold" : "normal"}
            onClick={() => setCurrentPage(i)}
          >
            {displayPage}
          </Text>
        )
      })}
    </Flex>
  )

  return (
    <Flex flexDirection="column" alignItems="center" pb={5} pt={5}>
      <Card width="90%" px={0}>
        <Flex>
          <BreadCrumb
            previousRoute="/a/settings"
            previousBreadCrumb="Settings"
            currentPage="Return Reasons"
          />
        </Flex>
        <Flex>
          <Text mb={3} fontSize={20} fontWeight="bold">
            Return Reasons
          </Text>
          <Box ml="auto" />
          <Button
            variant="cta"
            onClick={() => navigate("/a/settings/return-reasons/new")}
          >
            + Create Reason
          </Button>
        </Flex>
        <Card.Body py={0} flexDirection="column">
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
            <ReturnReasonsList
              return_reasons={showReasons}
              onEditClick={reason => {
                navigate(`/a/settings/return-reasons/${reason.id}`)
              }}
            />
          )}
          <Flex width={1} mt={3} justifyContent="space-between">
            <Text mt={1}>
              {showReasons.length}{" "}
              {showReasons.length === 1 ? "reason" : "reasons"}
            </Text>
            <Flex alignItems="center">
              <Button
                mr={2}
                variant="primary"
                onClick={() => onPreviousClick()}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <Button
                variant="primary"
                onClick={() => onNextClick()}
                disabled={currentPage === numberOfPages - 1}
              >
                Next
              </Button>
            </Flex>
          </Flex>
        </Card.Body>
      </Card>
    </Flex>
  )
}

export default ReturnReasons
