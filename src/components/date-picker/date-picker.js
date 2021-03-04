import React from "react"
import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Box, Flex } from "rebass"
import Button from "../button"
import InputField from "../input"
import moment from "moment"
import styled from "@emotion/styled"

const DatePickerWrapper = styled(Box)`
  .date-picker {
    cursor: default;

    .react-datepicker__triangle {
      border-bottom-color: ${props => props.theme.colors.lightest};
    }
    .react-datepicker__month-container {
      .react-datepicker__header {
        background-color: ${props => props.theme.colors.lightest};
        border-bottom: none;
      }
    }

    .date {
      background-color: ${props => props.theme.colors.gray};
      color: ${props => props.theme.colors.dark};
      font-size: 14px;
      display: inline-block;
      margin: -1px;
      width: 40px;
      height: 40px;
      border: 1px solid #e3e8ee;
      box-sizing: border-box;
      position: relative;
      padding-top: 12px;
      line-height: 1;
      border-radius: 0;

      :hover {
        border-radius: 0;
        cursor: pointer;
      }
    }
    .chosen {
      background-color: ${props => props.theme.colors.medusa} !important;
      color: white;
    }
  }
`

const DatePicker = ({ date, onChange }) => {
  return (
    <DatePickerWrapper className="some-class-name">
      <ReactDatePicker
        selected={date}
        onChange={onChange}
        calendarClassName="date-picker"
        popperClassName="popper"
        popperPlacement="bottom-start"
        popperModifiers={{
          offset: {
            enabled: true,
            offset: "5px, 10px",
          },
          preventOverflow: {
            enabled: true,
            escapeWithReference: false,
            boundariesElement: "viewport",
          },
        }}
        dayClassName={d =>
          moment(d).format("YY,MM,DD") === moment(date).format("YY,MM,DD")
            ? "date chosen"
            : "date"
        }
        customInput={
          <InputField placeholder={"Select date"} placeholder="Select date" />
        }
        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
          <CustomHeader
            date={date}
            decreaseMonth={decreaseMonth}
            increaseMonth={increaseMonth}
          />
        )}
      />
    </DatePickerWrapper>
  )
}

export default DatePicker

const Header = styled(Flex)`
  background-color: ${props => props.theme.colors.lightest};
  align-items: center;
  border-bottom: none;
`

const CustomHeader = ({ date, decreaseMonth, increaseMonth, ...props }) => {
  return (
    <Header m="10px" justifyContent="space-between">
      <Button
        onClick={decreaseMonth}
        sx={{ background: "transparent", color: "black" }}
      >
        {"<"}
      </Button>
      {moment(date).format("MMMM, YYYY")}

      <Button
        onClick={increaseMonth}
        sx={{ background: "transparent", color: "black" }}
      >
        {">"}
      </Button>
    </Header>
  )
}
