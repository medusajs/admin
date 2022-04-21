import { GroupBase, StylesConfig } from "react-select"

export const SelectStyle: StylesConfig<unknown, true, GroupBase<unknown>> = {
  valueContainer: (provided) => ({
    ...provided,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 4,
    paddingBottom: 0,
    flexWrap: "nowrap",
    marginRight: 8,
  }),
  input: (provided) => ({ ...provided, padding: 0, margin: 0 }),
}
