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

type FieldMenuItemProps = {
  field: Field
  checked: boolean
  onChange: () => void
}

/******************** COMPONENTS ********************/

/**
 * Table field chip component.
 */
function Chip(props: ChipProps) {
  const { remove, short } = props
  return (
    <div className="rounded-lg h-[32px] inline-flex gap-1 shrink-0 items-center text-small text-grey-70 border border-gray-70 px-3 mr-1 last:mr-2">
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
 * `FieldMenu` item component.
 */
function FieldMenuItem(props: FieldMenuItemProps) {
  const { checked, field, onChange } = props
  return (
    <DropdownMenu.Item>
      <Checkbox
        checked={checked}
        className="px-[6px] mx-2 h-[32px] hover:bg-grey-10 rounded text-small"
        onChange={onChange}
        label={
          typeof field.label === "function"
            ? field.label({ isSelected: props.checked })
            : field.label
        }
      />
    </DropdownMenu.Item>
  )
}

/******************** CONTAINERS ********************/

/**
 * The dropdown menu for selecting currently active table fields.
 */
function FieldsMenu(props: FieldsMenuProps) {
  const { fields, onBlur, selectedFields } = props

  const contentRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  // local copy of selected filters which is synced with the container list on blur
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

  // close dropdown "manually" on click outside the menu
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
          className="rounded-lg h-[32px] px-3 text-small font-semibold text-grey-90 inline-flex"
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
        {fields.map((f) => (
          <FieldMenuItem
            key={f.id}
            field={f}
            onChange={() => toggleCheck(f.id)}
            checked={currentlySelected.includes(f.id)}
          />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

/**
 * Table fields filter root container.
 */
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
  _selected.sort((a, b) => a.localeCompare(b))

  const visibleFields = _selected.map((id) => fields.find((f) => f.id === id))

  return (
    <div className="flex-wrap flex items-center gap-y-2">
      <span className="text-small font-semibold whitespace-nowrap text-gray-500 mr-2">
        Currently editing these fields:
      </span>

      {visibleFields.map((f) => (
        <Chip key={f!.id} remove={() => removeSelected(f!.id)} {...f!} />
      ))}

      <FieldsMenu
        fields={sortBy(fields, "id")}
        onBlur={setSelectedFields}
        selectedFields={_selected}
      />
    </div>
  )
}

export default TableFieldsFilters
