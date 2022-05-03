import { storiesOf } from "@storybook/react"
import React from "react"
import useState from "storybook-addon-state"
import AsyncSelect from "."
import { SelectOption } from "../../types"

// Fake API
const options: SelectOption[] = []
for (let i = 0; i < 50; ++i) {
  options.push({
    value: `id_${i + 1}`,
    label: `Option ${i + 1}`,
  })
}

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined)
    }, ms)
  })

const loadOptions = async (search, prevOptions) => {
  await sleep(1000)

  let filteredOptions: SelectOption[] = []
  if (!search) {
    filteredOptions = options
  } else {
    const searchLower = search.toLowerCase()

    filteredOptions = options.filter(({ label }) =>
      label.toLowerCase().includes(searchLower)
    )
  }

  const hasMore = filteredOptions.length > prevOptions.length + 10
  const slicedOptions = filteredOptions.slice(
    prevOptions.length,
    prevOptions.length + 10
  )

  return {
    options: slicedOptions,
    hasMore,
  }
}

// Stories
storiesOf("Molecules/AsyncSelect", module).add("Createable", () => {
  const [value, setValue] = useState<SelectOption | undefined>(
    "value",
    undefined
  )

  const addNewOption = async (inputValue: string) => {
    await sleep(1000)

    const newOption = {
      label: inputValue,
      value: inputValue,
    }

    options.push(newOption)

    setValue(newOption)

    return newOption
  }

  return (
    <div className="max-w-xl flex-1 flex flex-col gap-y-base">
      <h1 className="inter-xlarge-semibold">Createable Example</h1>
      <AsyncSelect
        label="Option"
        onChange={(newValue) => setValue(newValue as SelectOption | undefined)}
        value={value}
        isClearable={true}
        onCreateOption={addNewOption}
        isCreateable={true}
        isSearchable={true}
        loadOptions={loadOptions}
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

storiesOf("Molecules/AsyncSelect", module).add("Non-createable", () => {
  const [value, setValue] = useState<SelectOption | undefined>(
    "value",
    undefined
  )

  return (
    <div className="max-w-xl flex-1 flex flex-col gap-y-base">
      <h1 className="inter-xlarge-semibold">Non-Createable Example</h1>
      <AsyncSelect
        label="Option"
        onChange={(newValue) => setValue(newValue as SelectOption | undefined)}
        value={value}
        isClearable={true}
        isSearchable={true}
        loadOptions={loadOptions}
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

storiesOf("Molecules/AsyncSelect", module).add("Non-searchable", () => {
  const [value, setValue] = useState<SelectOption | undefined>(
    "value",
    undefined
  )

  return (
    <div className="max-w-xl flex-1 flex flex-col gap-y-base">
      <h1 className="inter-xlarge-semibold">Non-Searchable Example</h1>
      <AsyncSelect
        label="Option"
        onChange={(newValue) => setValue(newValue as SelectOption | undefined)}
        value={value}
        isSearchable={false}
        isClearable={true}
        loadOptions={loadOptions}
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

storiesOf("Molecules/AsyncSelect", module).add("Disabled", () => {
  const [value, setValue] = useState<SelectOption | undefined>(
    "value",
    undefined
  )

  return (
    <div className="max-w-xl flex-1 flex flex-col gap-y-base">
      <h1 className="inter-xlarge-semibold">Disabled Example</h1>
      <AsyncSelect
        placeholder="No clicks allowed"
        isDisabled={true}
        label="Option"
        onChange={(newValue) => setValue(newValue as SelectOption | undefined)}
        value={value}
        isSearchable={false}
        isClearable={true}
        loadOptions={loadOptions}
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

storiesOf("Molecules/AsyncSelect", module).add(
  "Custom search placeholder",
  () => {
    const [value, setValue] = useState<SelectOption | undefined>(
      "value",
      undefined
    )

    return (
      <div className="max-w-xl flex-1 flex flex-col gap-y-base">
        <h1 className="inter-xlarge-semibold">
          Custom Search Placeholder Example
        </h1>
        <AsyncSelect
          placeholder="Select a country"
          searchPlaceholder="Search for a country..."
          label="Country"
          required={true}
          onChange={(newValue) =>
            setValue(newValue as SelectOption | undefined)
          }
          value={value}
          isSearchable={true}
          isClearable={true}
          loadOptions={loadOptions}
        />
        <span className="inter-base-regular">
          Current value:{" "}
          <span className="px-2 py-1 bg-grey-20 rounded-base">
            {value ? JSON.stringify(value, null, 2) : "undefined"}
          </span>
        </span>
      </div>
    )
  }
)

storiesOf("Molecules/AsyncSelect", module).add("With Tooltip", () => {
  const [value, setValue] = useState<SelectOption | undefined>(
    "value",
    undefined
  )

  return (
    <div className="max-w-xl flex-1 flex flex-col gap-y-base">
      <h1 className="inter-xlarge-semibold">Tooltip Example</h1>
      <AsyncSelect
        placeholder="Select a country"
        searchPlaceholder="Search for a country..."
        label="Country"
        tooltip="This is a tooltip"
        required={true}
        onChange={(newValue) => setValue(newValue as SelectOption | undefined)}
        value={value}
        isSearchable={true}
        isClearable={true}
        loadOptions={loadOptions}
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
