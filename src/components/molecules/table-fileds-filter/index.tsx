import React, { useEffect, useRef, useState } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"

import PlusIcon from "../../fundamentals/icons/plus-icon"
import Button from "../../fundamentals/button"
import CrossIcon from "../../fundamentals/icons/cross-icon"
import Checkbox from "../../atoms/checkbox"
import { sortBy } from "lodash"

/**
 * TODO:
 *
 * 1. Change selected on blur
 * 2. Description text
 * 3. Label component with active prop
 * 4. Overflow
 */

type Field = { id: string; label: React.ReactNode; short: string }

type ChipProps = Field & {
  remove: () => void
}

function Chip(props: ChipProps) {
  const { remove, short } = props
  return (
    <div className="rounded rounded-lg h-[32px] flex gap-1 items-center px-3 text-small text-grey-70 border border-gray-70">
      {short}
      <CrossIcon
        className="text-grey-40 cursor-pointer"
        onClick={remove}
        size={13}
      />
    </div>
  )
}

type TableFieldsFilterProps = {
  fields: Field[]
  onChange: (selectedFieldIds: string[]) => void
}

type FieldsMenuProps = {
  fields: Field[]
  onBlur: (ids: string[]) => void
  selectedFields: string[]
}

function FieldsMenu(props: FieldsMenuProps) {
  const { fields, onBlur, selectedFields } = props

  const [open, setOpen] = useState(false)
  const [currentlySelected, setCurrentlySelected] = useState<string[]>([])
  const contentRef = useRef()

  const onTriggerClick = () => {
    setOpen(true)
  }

  const toggleCheck = (id: string) => {
    if (currentlySelected.includes(id)) {
      setCurrentlySelected(currentlySelected.filter((f) => f !== id))
    } else {
      setCurrentlySelected([...currentlySelected, id])
    }
  }

  useEffect(() => {
    if (open) {
      setCurrentlySelected(selectedFields)
    }
  }, [open, selectedFields])

  useEffect(() => {
    if (!open) {
      onBlur(currentlySelected)
    }
  }, [open])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!contentRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [contentRef])

  return (
    <DropdownMenu.Root open={open}>
      <DropdownMenu.Trigger>
        <Button
          onClick={onTriggerClick}
          variant="secondary"
          className="rounded rounded-lg h-[32px] px-3 text-small font-semibold text-grey-90"
        >
          Add fields <PlusIcon size={14} />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        ref={contentRef}
        className="w-[240px] bg-white shadow rounded-xl p-2"
      >
        {fields.map((f) => (
          <DropdownMenu.Item key={f.id}>
            <Checkbox
              className="px-[6px] h-[32px] hover:bg-grey-10 rounded text-small"
              checked={currentlySelected.includes(f.id)}
              onChange={() => toggleCheck(f.id)}
              label={f.label}
            />
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

function TableFieldsFilters(props: TableFieldsFilterProps) {
  const { fields, onChange } = props

  const [selectedFields, setSelectedFields] = useState<Field["id"][]>([])

  useEffect(() => {
    onChange(selectedFields)
  }, [selectedFields])

  const removeSelected = (id: string) => {
    setSelectedFields(selectedFields.filter((f) => f !== id))
  }

  const _selected = [...selectedFields]
  _selected.sort()

  return (
    <div className="flex gap-1">
      <div className="flex gap-1">
        {fields
          .filter((f) => selectedFields.includes(f.id))
          .map((f) => (
            <Chip key={f.id} {...f} remove={() => removeSelected(f.id)} />
          ))}
      </div>

      <FieldsMenu
        fields={sortBy(fields, "id")}
        onBlur={setSelectedFields}
        selectedFields={selectedFields}
      />
    </div>
  )
}

export default TableFieldsFilters
