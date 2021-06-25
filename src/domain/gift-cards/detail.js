import React, { useState, useRef, useEffect } from "react"
import { Text, Flex, Box, Image } from "rebass"
import { navigate } from "gatsby"
import ReactJson from "react-json-view"
import styled from "@emotion/styled"
import MultiSelect from "react-multi-select-component"
import _ from "lodash"

import Card from "../../components/card"
import Spinner from "../../components/spinner"
import Badge from "../../components/badge"
import Button from "../../components/button"
import EditableInput from "../../components/editable-input"
import CurrencyInput from "../../components/currency-input"
import Select from "../../components/select"

import useMedusa from "../../hooks/use-medusa"
import { Input } from "@rebass/forms"
import Typography from "../../components/typography"

const ProductLink = styled(Text)`
  color: #006fbb;
  z-index: 1000;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  `

const ProductThumbnail = styled(Image)`
  object-fit: contain;
  width: 35px;
  height: 35px;
`

const Divider = props => (
  <Box
    {...props}
    as="hr"
    m={props.m}
    sx={{
      bg: "#e3e8ee",
      border: 0,
      height: 1,
    }}
  />
)

const GiftCardDetail = ({ id }) => {
  const [updating, setUpdating] = useState(false)
  const [showRuleEdit, setShowRuleEdit] = useState(false)
  const [code, setCode] = useState(discount && discount.code)
  const [balance, setBalance] = useState(0)
  const [selectedRegions, setSelectedRegions] = useState([])

  const balanceRef = useRef()
  const discountCodeRef = useRef()

  const {
    gift_card: discount,
    update,
    refresh,
    isLoading,
    toaster,
  } = useMedusa("giftCards", {
    id,
  })
  const { regions } = useMedusa("regions")

  const formatNumber = n => {
    if(discount){
      return (
        ((1 + discount.region.tax_rate / 100) * n) / 100 
      ).toFixed(2)
    }
    return n
  }

  useEffect(() => {
    if (discount) {
      setCode(discount.code)
      setBalance(formatNumber(discount.balance))
    }
  }, [discount])

  if (isLoading || updating || !discount || !regions) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  const onTitleBlur = () => {
    if (discount.code === code) return

    update({
      code: code,
    })
      .then(() => {
        refresh({ id })
        setUpdating(false)
        toaster("Discount updated", "success")
      })
      .catch(() => {
        setUpdating(false)
        refresh({ id })
        toaster("Discount update failed", "error")
      })
  }

  const handleDisabled = () => {
    setUpdating(true)
    update({
      is_disabled: discount.is_disabled ? false : true,
    })
      .then(() => {
        refresh({ id })
        setUpdating(false)
        toaster("Discount updated", "success")
      })
      .catch(() => {
        setUpdating(false)
        toaster("Discount update failed", "error")
      })
  }

  const handleDiscountRuleUpdate = data => {
    setUpdating(true)
    update({
      rule: data,
    })
      .then(() => {
        refresh({ id })
        setUpdating(false)
        setShowRuleEdit(false)
        toaster("Discount rule updated", "success")
      })
      .catch(() => {
        setUpdating(false)
        setShowRuleEdit(false)
        toaster("Discount rule update failed", "error")
      })
  }


  const handleBalanceUpdate = () => {
    if (discount.balance === balance) return

    update({
      balance: Math.round(balance * 100),
    })
      .then(() => {
        refresh({ id })
        toaster("Balance updated", "success")
      })
      .catch(() => {
        refresh({ id })
        toaster("Balance update failed", "error")
      })
  }

  const handleRegionSelected = data => {
    console.log(data)
    //  const toUpdateWith = regions.reduce((acc, next) => {
    //    if (data.map(el => el.value).includes(next.id)) {
    //      acc.push(next.id)
    //    }
    //    return acc
    //  }, [])

    //  setUpdating(true)
    //  update({
    //    regions: toUpdateWith,
    //  })
    //    .then(() => {
    //      refresh({ id })
    //      setUpdating(false)
    //      toaster("Discount updated", "success")
    //    })
    //    .catch(() => {
    //      setUpdating(false)
    //      toaster("Discount update failed", "error")
    //    })
  }

  return (
    <Flex flexDirection="column" mb={5} pt={5}>
      <Card mb={2}>
        <Card.Header
          action={{
            label: discount.is_disabled ? "Enable" : "Disable",
            onClick: () => handleDisabled(),
          }}
        >
          {discount.id}
        </Card.Header>
        <Box>
          {code && (
            <EditableInput
              text={code}
              childRef={discountCodeRef}
              type="input"
              style={{ maxWidth: "400px" }}
              onBlur={onTitleBlur}
            >
              <Input
                m={3}
                ref={discountCodeRef}
                type="text"
                name="code"
                value={code}
                onChange={e => setCode(e.target.value)}
              />
            </EditableInput>
          )}
        </Box>
        <Card.Body>
          <Box pl={3} pr={2} textAlign="center" >
            <Text pb={1} mb={2} color="gray" >
              Disabled
            </Text>
            <Text pt={1} width="100%"  mt={2}>
              <Badge width="100%" color="#4f566b" bg="#e3e8ee">
                {`${discount.is_disabled}`}
              </Badge>
            </Text>
          </Box>
          <Card.VerticalDivider mx={3} />
          <Box pl={3} pr={2} alignContent="center">
            <Text pb={1} pb={3} color="gray" textAlign="center" >
              Valid regions
            </Text>
            <Select
              mr={3}
              height={"32px"}
              fontSize={1}
              placeholder={"Set valid region"}
              value={discount.region.id}
              onChange={handleRegionSelected}
              options={regions.map(o => ({
                label: o.name,
                value: o.id,
              }))}
            />
          </Box>
          <Card.VerticalDivider mx={3} />
          <Box pl={3} pr={2} alignContent="center">
            <Text pb={1} mb={3} color="gray">
              Total value ({discount.region.currency_code.toUpperCase()})
            </Text>
            <Text style={{width: "100%", textAlign: "center"}}>
              {formatNumber(discount.value)}
            </Text>
          </Box>
          <Card.VerticalDivider mx={3} />
          <Box pl={3} pr={2} alignContent="center">
            <Text pb={1} color="gray">
              Balance ({discount.region.currency_code.toUpperCase()})
            </Text>
            <EditableInput
              text={balance}
              childRef={balanceRef}
              type="input"
              style={{ maxWidth: "400px" }}
              onBlur={handleBalanceUpdate}
            >
              <Input
                m={3}
                ref={balanceRef}
                type="text"
                name="balance"
                value={balance}
                onChange={e => setBalance(e.target.value)}
              />
            </EditableInput>
          </Box>
          
        </Card.Body>
      </Card>
      <Card mr={3} width="100%">
        <Card.Header>Raw gift card</Card.Header>
        <Card.Body>
          <ReactJson
            name={false}
            collapsed={true}
            src={discount}
            style={{ marginLeft: "20px" }}
          />
        </Card.Body>
      </Card>
      {showRuleEdit && (
        <DiscountRuleModal
          discount={discount}
          onUpdate={handleDiscountRuleUpdate}
          onDismiss={() => setShowRuleEdit(false)}
          products={products}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      )}
    </Flex>
  )
}

export default GiftCardDetail
