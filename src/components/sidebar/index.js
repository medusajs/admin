import React, { useEffect, useState } from "react"
import { Flex, Box, Text } from "rebass"
import { navigate } from "gatsby"
import styled from "@emotion/styled"
import { Container, InlineLogoContainer, LogoContainer } from "./elements"
import { ReactComponent as Settings } from "../../assets/svg/settings.svg"
import { ReactComponent as Orders } from "../../assets/svg/orders.svg"
import { ReactComponent as Products } from "../../assets/svg/products.svg"
import { ReactComponent as Customers } from "../../assets/svg/customers.svg"
import { ReactComponent as Discounts } from "../../assets/svg/discounts.svg"
import { ReactComponent as Logo } from "../../assets/svg/logo.svg"
import { ReactComponent as GiftCard } from "../../assets/svg/gift-card.svg"
import { ReactComponent as LogoInline } from "../../assets/svg/logo-horizontal.svg"
import Medusa from "../../services/api"

const StyledItemContainer = styled(Flex)`
  align-items: center;
  border-radius: 5pt;
  cursor: pointer;

  [fill*="red"] {
    fill: #454545;
  }

  &:hover {
    ${props =>
      !props.active &&
      `
      background-color: #e0e0e059;
    `}
  }

  ${props =>
    props.active &&
    `
    background-color: #e0e0e0;
  `}
`

const Sidebar = ({}) => {
  const [storeName, setStoreName] = useState("")
  const [path, setPath] = useState("")

  const fetchStore = async () => {
    const cache = localStorage.getItem("medusa::cache::store")
    if (cache) {
      setStoreName(cache)
    } else {
      const { data } = await Medusa.store.retrieve(({ data }) => data.store)
      if (data.store) {
        localStorage.setItem("medusa::cache::store", data.store.name)
        setStoreName(data.store.name)
      }
    }
  }

  const handleOnClick = async route => {
    navigate(`/a/${route}`)
    setPath(route)
  }

  useEffect(() => {
    fetchStore()
  }, [])

  // useEffect(() => {
  //   if (window) {
  //     setPath(window.location.pathname)
  //   }
  // }, [window])

  return (
    <Container fontSize={1} fontFamily={"body"} p={4}>
      <Flex mx={-2} alignItems="center">
        <LogoContainer width={1 / 12} mx={2}>
          <Logo style={{ transform: "scale(1.5)" }} />
        </LogoContainer>
        <Box mx={1}>
          <Text>{storeName || "Medusa store"}</Text>
        </Box>
      </Flex>
      <Flex py={4} mx={-1} flexDirection="column" flex={1}>
        <StyledItemContainer
          mb={1}
          py={1}
          px={2}
          active={path.includes("orders")}
          onClick={() => handleOnClick("orders")}
        >
          <Orders />
          <Text ml={2} variant="nav">
            Orders
          </Text>
        </StyledItemContainer>
        <StyledItemContainer
          mb={1}
          py={1}
          px={2}
          active={path.includes("products")}
          onClick={() => handleOnClick("products")}
        >
          <Products />
          <Text ml={2} variant="nav">
            Products
          </Text>
        </StyledItemContainer>
        <StyledItemContainer
          mb={1}
          py={1}
          px={2}
          active={path.includes("customers")}
          onClick={() => handleOnClick("customers")}
        >
          <Customers />
          <Text ml={2} variant="nav">
            Customers
          </Text>
        </StyledItemContainer>
        <StyledItemContainer
          mb={1}
          py={1}
          px={2}
          active={path.includes("discounts")}
          onClick={() => handleOnClick("discounts")}
        >
          <Discounts />
          <Text ml={2} variant="nav">
            Discounts
          </Text>
        </StyledItemContainer>
        <StyledItemContainer
          mb={1}
          py={1}
          px={2}
          active={path.includes("giftcards")}
          onClick={() => handleOnClick("giftcards")}
        >
          <GiftCard />
          <Text ml={2} variant="nav">
            Gift Cards
          </Text>
        </StyledItemContainer>
        <StyledItemContainer
          mb={1}
          py={1}
          px={2}
          active={path.includes("settings")}
          onClick={() => handleOnClick("settings")}
        >
          <Settings />
          <Text ml={2} variant="nav">
            Settings
          </Text>
        </StyledItemContainer>
      </Flex>
      <Flex mx={-1} alignItems="center">
        <InlineLogoContainer px={2}>
          <LogoInline height={13} />
        </InlineLogoContainer>
      </Flex>
    </Container>
  )
}

export default Sidebar
