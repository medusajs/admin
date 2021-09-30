import React, { useEffect, useState, useRef, Children } from "react"
import { Box, Flex, Text } from "rebass"
import { Label } from "@rebass/forms"
import styled from "@emotion/styled"
import Typography from "../typography"
import useMedusa from "../../hooks/use-medusa"
import { ReactSelect } from "../react-select"
import { components } from "react-select"
import { ReactComponent as ArrowDown } from "../../assets/svg/arrow-down.svg"
import { ReactComponent as ArrowUp } from "../../assets/svg/arrow-up.svg"

const ReturnReasonsDropdown = ({ setReturnReason }) => {
  const { return_reasons, isLoading } = useMedusa("returnReasons")
  const [selectValue, setSelectValue] = useState(null)
  const [groupedOptions, setGroupedOptions] = useState([])

  useEffect(() => {
    if (isLoading) {
      return
    }
    setGroupedOptions(
      return_reasons.map(rr => {
        return rr?.return_reason_children?.length > 0
          ? {
              ...rr,
              collapsed: true,
              options: rr.return_reason_children,
            }
          : { ...rr, options: null }
      })
    )
  }, [isLoading])

  if (isLoading) {
    return <></>
  }

  // handle options group header click event
  // hide and show the options under clicked group
  const handleHeaderClick = props => {
    console.log(props)
    setGroupedOptions(
      groupedOptions.map(groupedOption =>
        groupedOption.label === props.data.label
          ? { ...groupedOption, collapsed: !groupedOption.collapsed }
          : groupedOption
      )
    )
  }

  // Create custom GroupHeading component, which will wrap
  // react-select GroupHeading component inside a div and
  // register onClick event on that div
  const CustomGroupHeading = props => {
    return (
      <Flex
        alignItems="center"
        justifyContent="space-between"
        width={1}
        sx={{
          heigth: "30px",
          pr: "3",
          py: "0",
          borderBottom: "1px solid #E3E8EE",
          my: "0",
          "& div": {
            pb: "0",
            pt: "0",
            width: "100%",
            lineHeight: "30px",
            color: "#000000CC",
            fontSize: "11px",
            height: "30px",
          },
          "& svg": {
            mb: "1",
          },
        }}
        onClick={() => handleHeaderClick(props)}
      >
        <components.GroupHeading {...props} />
        {props.data.collapsed ? (
          <ArrowDown fill={"#000000"} style={{ display: "block" }} />
        ) : (
          <ArrowUp fill={"#000000"} style={{ display: "block" }} />
        )}
      </Flex>
    )
  }

  const customMenu = props => {
    return (
      <Flex
        sx={{
          minWidth: "140px",
          width: "auto",
          "& div": {
            minWidth: "140px",
            width: "auto",
            maxWidth: "250px",
            overflow: "hidden",
          },
        }}
      >
        <components.Menu {...props} />
      </Flex>
    )
  }

  const CustomGroup = props => {
    let { children, ...rest } = props
    if (!props.headingProps.data.collapsed) {
      rest.children = children
    }
    return (
      <Flex
        sx={{
          width: "100%",
          py: "0",
          "& div": { py: "0", width: "100%" },
        }}
      >
        <components.Group {...rest} />
      </Flex>
    )
  }

  const CustomOption = props => {
    const st = {
      height: "30px",
      my: "0",
      width: "100%",
      py: "0",
      "& div": {
        my: "0",
        py: "0",
        width: "100%",
        lineHeight: "30px",
        height: "30px",
      },
    }
    const style = props.data.parent_return_reason_id
      ? { bg: "light", borderBottom: "1px solid #E3E8EE", ...st }
      : st

    return (
      <Flex sx={style}>
        <components.Option {...props} />
      </Flex>
    )
  }

  return (
    <ReactSelect
      options={groupedOptions}
      value={selectValue}
      onMenuOpen={() => {
        setReturnReason(null)
        setSelectValue(null)
      }}
      onChange={returnReason => {
        setReturnReason(returnReason)
        setSelectValue(returnReason)
      }}
      closeMenuOnSelect={true}
      onMouseMove={() => {}}
      onMouseOver={() => {}}
      components={{
        GroupHeading: CustomGroupHeading,
        Group: CustomGroup,
        Option: CustomOption,
        Menu: customMenu,
      }}
    />
  )
}

export default ReturnReasonsDropdown
