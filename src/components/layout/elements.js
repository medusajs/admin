import styled from "@emotion/styled"
import { Flex, Box, Text } from "rebass"

import Input from "../input"

export const Container = styled(Flex)`
  position: relative;
  flex-direction: column;
  min-height: 100vh;
`

export const Main = styled(Box)`
  display: grid;
  grid-template-columns: 325px 1fr;
  grid-template-rows: 1fr;
  min-height: 100vh;
  flex: 1;
`

export const Body = styled(Box)`
  width: 100%;
  max-width: 1200px;
  // height: 120vh;
`

export const Content = styled(Flex)`
  position: relative;
  flex-direction: column;
  overflow-y: scroll;
  // overflow-x: hidden;
  height: 100vh;
  background-color: ${props => props.theme.colors.lightest};
  box-shadow: rgba(0, 0, 0, 0.03) -1px 0px 99px 0px,
    rgba(0, 0, 0, 0.02) -1px 0px 2px 0px;
`

export const SearchBar = styled(Input)`
  margin-left: -8px;
  input {
    border: none !important;
    box-shadow: none !important;
    height: 42px;
    border-radius: 0;
    margin: auto;
    max-width: 1200px;
    ::placeholder {
      color: black;
      font-weight: 400;
    }
  }
`
