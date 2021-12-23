import React from "react"

const SearchInput = React.forwardRef((props, ref) => (
  <div>
    <input
      ref={ref}
      className="placeholder:inter-base-regular placeholder-grey-40 focus:outline-none"
      {...props}
    />
  </div>
))

export default SearchInput
