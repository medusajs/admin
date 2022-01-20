import { InputHeaderProps } from "../../fundamentals/input-header"

export type DateTimePickerProps = {
  date: Date
  onChange: (newDate: Date) => void
} & InputHeaderProps
