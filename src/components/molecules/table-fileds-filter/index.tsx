import React, { useEffect, useState } from "react"

type Field = { id: string; title: string }

function Chip(props: Field) {
  const { name } = props
  return <div>{name}</div>
}

type TableFieldsFilterProps = {
  fields: Field[]
  onChange: (selectedFieldIds: string[]) => void
}

function TableFieldsFilter(props: TableFieldsFilterProps) {
  const { fields, onChange } = props

  const [selectedFields, setSelectedFields] = useState<Field[]>([])

  useEffect(() => {
    const ids = selectedFields.map((f) => f.id)
    onChange(ids)
  }, [selectedFields])

  return (
    <div>
      {selectedFields.map((f) => (
        <Chip key={f.id} {...f} />
      ))}
    </div>
  )
}

export default TableFieldsFilter
