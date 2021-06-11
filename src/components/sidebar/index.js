import React, { useEffect, useState } from "react"
import { Flex, Box, Text } from "rebass"
import { Link, navigate } from "gatsby"
import styled from "@emotion/styled"
import Collapsible from "react-collapsible"
import { Container } from "./elements"
import Medusa from "../../services/api"

const StyledItemContainer = styled(Link)`
  display: flex;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 8px;
  align-items: center;
  border-radius: 5pt;
  cursor: pointer;

  text-decoration: none;
  color: black;
  height: 30px;

  svg {
    max-height: 20px;
    max-width: 20px;
  }

  img {
    max-height: 18px;
    max-width: 18px;
    margin: 0px;
  }

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

  &.active {
    background-color: #e0e0e0;
    font-weight: 600;
  }
`

const Sidebar = ({}) => {
  const [storeName, setStoreName] = useState("")
  const [activeTab, setActiveTab] = useState()

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

  useEffect(() => {
    fetchStore()
  }, [])

  const handleTabClick = (tab, isCollapse = false) => {
    if (activeTab === tab && !isCollapse) {
      setActiveTab()
    } else {
      setActiveTab(tab)
    }
  }

  return (
    <Container fontSize={1} fontFamily={"body"} pb={3} pt={4} px={4}>
      <Flex
        mx={-2}
        alignItems="center"
        onClick={() => navigate("/")}
        sx={{ cursor: "pointer" }}
      >
        <Box mx={1}>
          <Text fontWeight="500">{storeName || "-"}</Text>
        </Box>
      </Flex>
      <Flex py={4} mx={-1} flexDirection="column" flex={1}>
        <StyledItemContainer
          to="/a/home"
          activeClassName="active"
          partiallyActive
          onClick={() => handleTabClick("home")}
        >
          <img src="https://img.icons8.com/ios/50/000000/online-shopping.png" />
          <Text ml={2} variant="nav">
            Home
          </Text>
        </StyledItemContainer>
        <Collapsible
          transitionTime={150}
          transitionCloseTime={150}
          open={activeTab === "orders"}
          trigger={
            <StyledItemContainer
              to="/a/orders"
              activeClassName="active"
              onClick={() => handleTabClick("orders", true)}
              partiallyActive
            >
              <img src="https://img.icons8.com/ios/50/000000/purchase-order.png" />
              <Text ml={2} variant="nav">
                Orders
              </Text>
            </StyledItemContainer>
          }
        >
          <StyledItemContainer
            to="/a/draft-orders"
            activeClassName="active"
            partiallyActive
          >
            <Flex alignItems="center" pl={3} width="100%">
              <Text ml="14px" variant="nav" fontSize="12px">
                Drafts
              </Text>
            </Flex>
          </StyledItemContainer>
          <StyledItemContainer
            to="/a/swaps"
            activeClassName="active"
            partiallyActive
          >
            <Flex alignItems="center" pl={3} width="100%">
              <Text ml="14px" variant="nav" fontSize="12px">
                Swaps
              </Text>
            </Flex>
          </StyledItemContainer>
          <StyledItemContainer
            to="/a/returns"
            activeClassName="active"
            partiallyActive
          >
            <Flex alignItems="center" pl={3} width="100%">
              <Text ml="14px" variant="nav" fontSize="12px">
                Returns
              </Text>
            </Flex>
          </StyledItemContainer>
        </Collapsible>
        <Collapsible
          transitionTime={150}
          transitionCloseTime={150}
          open={activeTab === "products"}
          trigger={
            <StyledItemContainer
              to="/a/products"
              activeClassName="active"
              partiallyActive
              onClick={() => handleTabClick("products", true)}
            >
              <img src="https://img.icons8.com/ios/50/000000/product--v1.png" />
              <Text ml={2} variant="nav">
                Products
              </Text>
            </StyledItemContainer>
          }
        >
          <StyledItemContainer
            to="/a/collections"
            activeClassName="active"
            partiallyActive
          >
            <Flex alignItems="center" pl={3} width="100%">
              <Text ml="14px" variant="nav" fontSize="12px">
                Collections
              </Text>
            </Flex>
          </StyledItemContainer>
        </Collapsible>
        <StyledItemContainer
          to="/a/customers"
          activeClassName="active"
          partiallyActive
          onClick={() => handleTabClick("customers")}
        >
          <img src="https://img.icons8.com/ios/50/000000/gender-neutral-user.png" />
          <Text ml={2} variant="nav">
            Customers
          </Text>
        </StyledItemContainer>
        <StyledItemContainer
          to="/a/discounts"
          activeClassName="active"
          partiallyActive
          onClick={() => handleTabClick("discounts")}
        >
          <img src="https://img.icons8.com/ios/50/000000/discount.png" />
          <Text ml={2} variant="nav">
            Discounts
          </Text>
        </StyledItemContainer>
        <StyledItemContainer
          to="/a/gift-cards"
          activeClassName="active"
          partiallyActive
          onClick={() => handleTabClick("gift-cards")}
        >
          <img src="https://img.icons8.com/ios/50/000000/gift-card.png" />
          <Text ml={2} variant="nav">
            Gift Cards
          </Text>
        </StyledItemContainer>
        <StyledItemContainer
          to="/a/settings"
          activeClassName="active"
          partiallyActive
          onClick={() => handleTabClick("settings")}
        >
          <img src="https://img.icons8.com/ios/50/000000/settings--v1.png" />
          <Text ml={2} variant="nav">
            Settings
          </Text>
        </StyledItemContainer>
      </Flex>
    </Container>
  )
}

export default Sidebar
