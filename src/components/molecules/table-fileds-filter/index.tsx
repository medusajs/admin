import React, { useEffect, useRef, useState } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { sortBy } from "lodash"

import PlusIcon from "../../fundamentals/icons/plus-icon"
import Button from "../../fundamentals/button"
import CrossIcon from "../../fundamentals/icons/cross-icon"
import Checkbox from "../../atoms/checkbox"

/******************** TYPES ********************/

type Field = {
  id: string
  short: string
  label: React.ReactChild | ((args: { isSelected: boolean }) => void)
}

type ChipProps = Field & {
  remove: () => void
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

/******************** COMPONENTS ********************/

/**
 * Table field chip component.
 */
function Chip(props: ChipProps) {
  const { remove, short } = props
  return (
    <div className="rounded rounded-lg h-[32px] flex gap-1 shrink-0 items-center px-3 text-small text-grey-70 border border-gray-70">
      {short}
      <CrossIcon
        className="text-grey-40 cursor-pointer"
        onClick={remove}
        size={13}
      />
    </div>
  )
}

/**
 * A dropdown menu for selecting currently active table fields.
 */
function FieldsMenu(props: FieldsMenuProps) {
  const { fields, onBlur, selectedFields } = props

  const contentRef = useRef()
  const [open, setOpen] = useState(false)
  const [currentlySelected, setCurrentlySelected] = useState<string[]>([])

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
          <span className="flex whitespace-nowrap items-center gap-1">
            Add fields <PlusIcon size={14} />
          </span>
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        ref={contentRef}
        className="w-[240px] bg-white shadow rounded-xl p-2"
      >
        {fields.map((f) => {
          const isSelected = currentlySelected.includes(f.id)
          return (
            <DropdownMenu.Item key={f.id}>
              <Checkbox
                checked={isSelected}
                className="px-[6px] h-[32px] hover:bg-grey-10 rounded text-small"
                onChange={() => toggleCheck(f.id)}
                label={
                  typeof f.label === "function"
                    ? f.label({ isSelected })
                    : f.label
                }
              />
            </DropdownMenu.Item>
          )
        })}
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
    <div className="flex items-center gap-2">
      <span className="text-small font-semibold text-gray-500 whitespace-nowrap">
        Currently editing these fields:
      </span>

      <div className="flex gap-1 overflow-x-auto no-scrollbar::-webkit-scrollbar">
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
