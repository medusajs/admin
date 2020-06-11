import styled from "@emotion/styled"
import { Flex, Box } from "rebass"

export const LogoContainer = styled(Flex)`
  svg {
    width: 15px;
    height: 15px;
  }
`

export const InlineLogoContainer = styled(Flex)`
  [fill*="red"] {
    fill: #454545;
  }
`

export const Container = styled(Flex)`
  height: 100%;
  width: 100%;
  background-color: ${props => props.theme.colors.light};
  flex-direction: column;
`
