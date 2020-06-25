import styled from "@emotion/styled"
import { Flex, Box } from "rebass"

export const Container = styled(Flex)`
  flex-direction: column;
  min-height: 100vh;
`

export const Main = styled(Box)`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;

  min-height: 100vh;
  flex: 1;
`

export const Body = styled(Flex)`
  width: 100%;
  max-width: 1200px;
  // height: 120vh;
`

export const Content = styled(Flex)`
  overflow-y: scroll;
  // overflow-x: hidden;
  height: 100vh;
  background-color: ${props => props.theme.colors.lightest};
  box-shadow: rgba(0, 0, 0, 0.03) -1px 0px 99px 0px,
    rgba(0, 0, 0, 0.02) -1px 0px 2px 0px;
`
