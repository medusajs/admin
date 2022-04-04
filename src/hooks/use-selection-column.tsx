import React from "react"
import Checkbox from "../components/atoms/checkbox"
import Table from "../components/molecules/table"

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <div onClickCapture={(e) => e.stopPropagation()}>
        <Checkbox
          className="justify-center"
          label=""
          ref={resolvedRef}
          {...rest}
        />
      </div>
    )
  }
)

export const useSelectionColumn = () => {
  return {
    id: "selection",
    // The header can use the table's getToggleAllRowsSelectedProps method
    // to render a checkbox
    Header: ({ getToggleAllRowsSelectedProps }) => (
      <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
    ),
    // The cell can use the individual row's getToggleRowSelectedProps method
    // to the render a checkbox
    Cell: ({ row }) => (
      <Table.Cell className="text-center">
        <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
      </Table.Cell>
    ),
  }
}
