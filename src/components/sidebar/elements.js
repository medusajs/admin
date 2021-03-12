import styled from "@emotion/styled"
import { Flex, Box } from "rebass"

export const LogoContainer = styled(Flex)`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 9999pt;

  img {
    width: 25px;
    height: 25px;
    margin: 0px;
  }

  box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
    rgb(0 0 0 / 12%) 0px 1px 1px 0px, rgb(60 66 87 / 16%) 0px 0px 0px 1px,
    rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
    rgb(60 66 87 / 8%) 0px 2px 5px 0px;
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
