import React, { useState } from "react"
import clsx from "clsx"
import SearchIcon from "../../fundamentals/icons/search-icon"

type TableSearchProps = {
  onSearch: (term: string) => void
} & React.HTMLAttributes<HTMLDivElement>

const TableSearch: React.FC<TableSearchProps> = ({
  onSearch,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "inter-small-regular transition-color transition-width duration-150 ease-in-out flex text-grey-50 flex items-center mb-1 pl-1 py-1.5 rounded border border-grey-0 w-29 focus-within:w-60 focus-within:shadow-input focus-within:border-violet-60 focus-within:bg-grey-5",
        className
      )}
      {...props}
    >
      <span className="px-2.5 py-0.5">
        <SearchIcon size={16} />
      </span>
      <input
        type="text"
        className="focus:outline-none focus:border-none inter-small-regular w-full focus:w-50 focus:bg-grey-5 focus:text-grey-90 caret-violet-60"
        placeholder="Search users"
        onChange={e => onSearch(e.target.value)}
      />
    </div>
  )
}

export default TableSearch
