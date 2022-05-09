import { useRef } from "react"
import Select from "."
import { SelectProps } from "../../types"

const PortalSelect = (props: SelectProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="relative">
      <Select {...props} />
    </div>
  )
}

export default PortalSelect
