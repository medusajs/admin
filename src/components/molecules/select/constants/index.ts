import { GroupBase, StylesConfig } from "react-select"

export const SelectStyle: StylesConfig<unknown, boolean, GroupBase<unknown>> = {
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
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 60,
  }),
  menu: () => ({ zIndex: 60, top: 0, marginBottom: "16px" }),
}
