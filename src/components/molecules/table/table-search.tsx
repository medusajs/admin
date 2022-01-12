import React, { useState } from "react"
import clsx from "clsx"
import SearchIcon from "../../fundamentals/icons/search-icon"

type FilteringOptionProps = {
  title: string
  options: {
    title: string
    count?: number
    onChange: (term: string) => void
  }[]
} & React.HTMLAttributes<HTMLDivElement>

const FilteringOptions: React.FC<FilteringOptionProps> = ({
  onSearch,
  className,
  ...props
}) => {
  const [selected, setSelected] = useState(options[0].title || "All")
  const [open, setOpen] = useState(false)
  return (
    <div
      className={clsx("inter-small-regular flex text-grey-50", className)}
      {...props}
    >
      <input type="text" />
    </div>
  )
}

export default FilteringOptions
