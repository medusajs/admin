import moment from "moment"
import React from "react"
import "react-datepicker/dist/react-datepicker.css"
import NativeSelect from "../../molecules/native-select"
import { ReactDatePickerCustomHeaderProps } from "react-datepicker"
import { months, years } from "./utils"

const CustomHeader = ({
  date,
  changeYear,
  changeMonth,
}: ReactDatePickerCustomHeaderProps) => {
  return (
    <div className="flex w-full gap-4 items-center">
      <div className="flex flex-1 items-center justify-end gap-3">
        <NativeSelect
          defaultValue={moment(date).format("MMMM")}
          onValueChange={(v) => changeMonth(months.indexOf(v))}
        >
          {months.map((month) => (
            <NativeSelect.Item value={month}>{month}</NativeSelect.Item>
          ))}
        </NativeSelect>
      </div>
      <div className="flex flex-1 items-center justify-start gap-3">
        <NativeSelect
          defaultValue={moment(date).format("YYYY")}
          onValueChange={(v) => changeYear(parseInt(v, 10))}
        >
          {years.map((year) => (
            <NativeSelect.Item value={year.toString()}>
              {year.toString()}
            </NativeSelect.Item>
          ))}
        </NativeSelect>
      </div>
    </div>
  )
}

export default CustomHeader
