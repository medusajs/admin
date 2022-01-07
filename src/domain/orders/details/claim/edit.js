import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import styled from "@emotion/styled"
import { useForm, useFieldArray } from "react-hook-form"
import _ from "lodash"

import Pill from "../../../../components/pill"
import Modal from "../../../../components/modal"
import CurrencyInput from "../../../../components/currency-input"
import ImageUpload from "../../../../components/image-upload"
import Input from "../../../../components/molecules/input"
import Button from "../../../../components/button"
import Dropdown from "../../../../components/dropdown"
import TextArea from "../../../../components/textarea"
import Select from "../../../../components/select"
import Typography from "../../../../components/typography"
import Medusa from "../../../../services/api"
import { getErrorMessage } from "../../../../utils/error-messages"

const removeNullish = obj =>
  Object.entries(obj).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {})

const Cross = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 5px;
  cursor: pointer;
`

const Dot = styled(Box)`
  width: 6px;
  height: 6px;
  border-radius: 50%;
`

const ImageCardWrapper = styled(Box)`
  position: relative;
  display: inline-block;
  height: 100px;
  width: 100px;
`

const StyledImageCard = styled(Box)`
  height: 100px;
  width: 100px;

  border: ${props => (props.selected ? "1px solid #53725D" : "none")};

  object-fit: contain;

  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.08) 0px 3px 9px 0px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;

  border-radius: 3px;
`

const StyledImageBox = styled(Flex)`
  flex-wrap: wrap;
  .img-container {
    border: 1px solid black;
    background-color: ${props => props.theme.colors.light};
    height: 50px;
    width: 50px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
`

const ClaimEdit = ({ claim, order, onSave, onDismiss, toaster }) => {
  const [items, setItems] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [noNotification, setNoNotification] = useState(claim.no_notification)
  const { handleSubmit } = useForm()

  useEffect(() => {
    if (_.isEmpty(items)) {
      setItems(
        claim.claim_items.reduce((acc, next) => {
          acc[next.id] = next
          return acc
        }, {})
      )
    }
  }, [claim])

  const reasonOptions = [
    {
      label: "Missing Item",
      value: "missing_item",
    },
    {
      label: "Wrong Item",
      value: "wrong_item",
    },
    {
      label: "Production Failure",
      value: "production_failure",
    },
  ]

  const onSubmit = () => {
    setSubmitting(true)

    if (onSave) {
      return onSave(claim.id, {
        claim_items: Object.entries(items).map(([k, v]) => {
          return removeNullish({
            id: k,
            reason: v.reason,
            note: v.note,
            tags:
              v.tags?.map(t => removeNullish({ id: t.id, value: t.value })) ||
              [],
            images:
              v.images?.map(i => removeNullish({ id: i.id, url: i.url })) || [],
          })
        }),
        no_notification: noNotification !== null ? noNotification : undefined,
      })
        .then(() => onDismiss())
        .then(() => toaster("Successfully updated claim", "success"))
        .catch(error => toaster(getErrorMessage(error), "error"))
        .finally(() => setSubmitting(false))
    }
  }

  const handleNoteChange = (e, key) => {
    const element = e.target

    setItems(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        note: element.value,
      },
    }))
  }

  const handleAddImage = (e, key) => {
    Medusa.uploads.create(e.target.files).then(({ data }) => {
      const uploaded = data.uploads.map(({ url }) => ({ url }))

      setItems(prev => ({
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          images: [...prev[key].images, ...uploaded],
        },
      }))
    })
  }

  const handleImageDelete = (url, key) => {
    Medusa.uploads.delete(url[0]).then(() => {
      setItems(prev => ({
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          images: prev[key].images.filter(im => im.url !== url),
        },
      }))
    })
  }

  const handleReasonChange = (e, key) => {
    const element = e.target

    setItems(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        reason: element.value,
      },
    }))
  }

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body as="form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>Claim</Modal.Header>
        <Modal.Content flexDirection="column">
          <Box mb={3}>
            <Text px={2}>Claim items</Text>
            <Flex
              sx={{
                borderBottom: "hairline",
              }}
              justifyContent="space-between"
              fontSize={1}
              py={2}
            >
              <Box width={400} px={2} py={1}>
                Details
              </Box>
              <Box width={75} px={2} py={1}>
                Quantity
              </Box>
            </Flex>
            {Object.entries(items).map(([key, item]) => {
              const oItem = order.items.find(i => i.id === item.item_id)
              return (
                <Flex
                  key={key}
                  flexWrap="wrap"
                  justifyContent="space-between"
                  fontSize={2}
                  py={2}
                >
                  <Box width={400} px={2} py={1}>
                    <Text fontSize={1} lineHeight={"14px"}>
                      {oItem.title}
                    </Text>
                    <Text fontSize={0}>{oItem.variant.sku}</Text>
                  </Box>
                  <Box textAlign={"center"} width={75} px={2} py={1}>
                    {item.quantity}
                  </Box>
                  <Flex height="300px" py={3} width="100%">
                    <Flex flex={"0 50%"} flexDirection="column">
                      <Box mt={4} px={2}>
                        <Select
                          inline
                          label="Reason"
                          mr={3}
                          height={"32px"}
                          fontSize={1}
                          placeholder={"Select reason"}
                          value={item.reason}
                          onChange={e => handleReasonChange(e, key)}
                          options={reasonOptions}
                        />
                      </Box>
                      <Box mt={4} px={2}>
                        <TextArea
                          inline
                          minHeight={"100px"}
                          label="Note"
                          value={item.note}
                          onChange={e => handleNoteChange(e, key)}
                        />
                      </Box>
                    </Flex>
                    <Flex flexDirection="column" height="100%" flex={1}>
                      <Box width="min-content">
                        <ImageUpload
                          button={item.images.length > 0}
                          onChange={e => handleAddImage(e, key)}
                          name="files"
                          label="Images"
                        />
                      </Box>
                      <StyledImageBox mt={4}>
                        {item.images.map(({ url }, i) => (
                          <ImageCardWrapper mr={3} key={i}>
                            <StyledImageCard
                              key={i}
                              as="img"
                              src={url}
                              sx={{}}
                            />
                            <Cross onClick={() => handleImageDelete(url, key)}>
                              &#x2715;
                            </Cross>
                          </ImageCardWrapper>
                        ))}
                      </StyledImageBox>
                    </Flex>
                  </Flex>
                </Flex>
              )
            })}
          </Box>
        </Modal.Content>
        <Modal.Footer justifyContent="space-between">
          <Flex>
            <Box px={0} py={1}>
              <input
                id="noNotification"
                name="noNotification"
                checked={!noNotification}
                onChange={() => setNoNotification(!noNotification)}
                type="checkbox"
              />
            </Box>
            <Box px={2} py={1}>
              <Text fontSize={1}>Send notifications</Text>
            </Box>
          </Flex>
          <Button loading={submitting} type="submit" variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ClaimEdit
