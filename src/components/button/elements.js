import styled from "@emotion/styled"
import Typography from "../typography"

export const ButtonContainer = styled.button`
  ${Typography.Base}

  box-shadow: ${props =>
    props.dark
      ? `
    rgba(255, 255, 255, 0) 0px 0px 0px 0px,
    rgba(255, 255, 255, 0) 0px 0px 0px 0px,
    rgba(255, 255, 255, 0.12) 0px 0px 0px 0px,
    rgba(255, 255, 255, 0.16) 0px 0px 0px 1px,
    rgba(255, 255, 255, 0.12) 0px 0px 0px 0px,
    rgba(255, 255, 255, 0) 0px 0px 0px 0px,
    rgba(255, 255, 255, 0.08) 0px 2px 5px 0px;
  `
      : `
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
    rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
  `};

  cursor: pointer;
  background-color: ${props =>
    props.dark ? props.theme.colors.dark : props.theme.colors.lightest};
  color: ${props =>
    props.dark ? props.theme.colors.lightest : props.theme.colors.dark};

  padding-top: 3px;
  padding-bottom: 3px;

  border-radius: 3px;
  border: 0;
  outline: 0;

  &:hover {
    color: ${props =>
      props.dark ? props.theme.colors.light : props.theme.colors.darkest};

    box-shadow: ${props =>
      props.dark
        ? `

      rgba(255, 255, 255, 0) 0px 0px 0px 0px,
      rgba(255, 255, 255, 0) 0px 0px 0px 0px,
      rgba(255, 255, 255, 0.12) 0px 0px 0px 0px,
      rgba(255, 255, 255, 0.16) 0px 0px 0px 1px,
      rgba(255, 255, 255, 0.12) 0px 0px 0px 0px,
      rgba(255, 255, 255, 0.08) 0px 3px 9px 0px,
      rgba(255, 255, 255, 0.08) 0px 2px 5px 0px;
    `
        : `
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
      rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(60, 66, 87, 0.08) 0px 3px 9px 0px,
      rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
    `};
  }

  &:active {
    color: ${props =>
      props.dark ? props.theme.colors.light : props.theme.colors.darkest};
    box-shadow:
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(206, 208, 190, 0.36) 0px 0px 0px 4px,
      rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
      rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(60, 66, 87, 0.08) 0px 3px 9px 0px;
      rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
  }
`
