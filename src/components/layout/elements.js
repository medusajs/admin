import styled from "@emotion/styled"
import { Flex, Box } from "rebass"

export const Container = styled(Flex)`
  flex-direction: column;
  min-height: 100vh;
`

export const Main = styled(Box)`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr;

  min-height: 100vh;
  flex: 1;
`

export const Content = styled(Box)`
  ${props => console.log(props)}
  background-color: ${props => props.theme.colors.light};
`
