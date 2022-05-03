import { storiesOf } from "@storybook/react"
import useState from "storybook-addon-state"
import Select from "."
import { SelectOption } from "../../types"

const options: SelectOption[] = []

for (let i = 0; i < 50; ++i) {
  options.push({
    value: `id_${i + 1}`,
    label: `Option ${i + 1}`,
  })
}

// Stories
storiesOf("Molecules/Select", module).add("Createable", () => {
  const [value, setValue] = useState<SelectOption | undefined>(
    "value",
    undefined
  )

  const addNewOption = (inputValue: string) => {
    const newOption = {
      label: inputValue,
      value: inputValue,
    }

    setValue(newOption)

    options.push(newOption)
  }

  return (
    <div className="max-w-xl flex-1 flex flex-col gap-y-base">
      <h1 className="inter-xlarge-semibold">Createable Example</h1>
      <Select
        label="Option"
        onChange={(newValue) => setValue(newValue as SelectOption | undefined)}
        value={value}
        options={options}
        isClearable={true}
        onCreateOption={addNewOption}
        isCreateable={true}
        isSearchable={true}
      />
      <span className="inter-base-regular">
        Current value:{" "}
        <span className="px-2 py-1 bg-grey-20 rounded-base">
          {value ? JSON.stringify(value, null, 2) : "undefined"}
        </span>
      </span>
    </div>
  )
})

storiesOf("Molecules/Select", module).add("Non-Createable", () => {
  const [value, setValue] = useState<SelectOption | undefined>(
    "value",
    undefined
  )

  return (
    <div className="max-w-xl flex-1 flex flex-col gap-y-base">
      <h1 className="inter-xlarge-semibold">Non-Createable Example</h1>
      <Select
        label="Option"
        onChange={(newValue) => setValue(newValue as SelectOption | undefined)}
        value={value}
        options={options}
        isClearable={true}
        isSearchable={true}
      />
      <span className="inter-base-regular">
        Current value:{" "}
        <span className="px-2 py-1 bg-grey-20 rounded-base">
          {value ? JSON.stringify(value, null, 2) : "undefined"}
        </span>
      </span>
    </div>
  )
})

storiesOf("Molecules/Select", module).add("Non-Searchable", () => {
  const [value, setValue] = useState<SelectOption | undefined>(
    "value",
    undefined
  )

  return (
    <div className="max-w-xl flex-1 flex flex-col gap-y-base">
      <h1 className="inter-xlarge-semibold">Non-Searchable Example</h1>
      <Select
        label="Option"
        onChange={(newValue) => setValue(newValue as SelectOption | undefined)}
        value={value}
        options={options}
        isClearable={true}
        isSearchable={false}
      />
      <span className="inter-base-regular">
        Current value:{" "}
        <span className="px-2 py-1 bg-grey-20 rounded-base">
          {value ? JSON.stringify(value, null, 2) : "undefined"}
        </span>
      </span>
    </div>
  )
})

storiesOf("Molecules/Select", module).add("Multiselect", () => {
  const [value, setValue] = useState<SelectOption[] | undefined>(
    "value",
    undefined
  )

  return (
    <div className="max-w-xl flex-1 flex flex-col gap-y-base">
      <h1 className="inter-xlarge-semibold">Multiselect Example</h1>
      <Select
        label="Option"
        onChange={(newValue) =>
          setValue(newValue as SelectOption[] | undefined)
        }
        value={value}
        options={options}
        isClearable={true}
        isSearchable={false}
        isMulti={true}
        hasSelectAll={true}
      />
      <span className="inter-base-regular">
        Current value:{" "}
        <span className="px-2 py-1 bg-grey-20 rounded-base">
          {value ? JSON.stringify(value, null, 2) : "undefined"}
        </span>
      </span>
    </div>
  )
})
