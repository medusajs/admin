import { GroupBase } from "react-select"

declare module "react-select/dist/declarations/src/Select" {
  export interface Props<
    Option,
    IsMulti extends boolean,
    Group extends GroupBase<Option>
  > {
    /**
     * An optional label to display above the select.
     * 
     * @defaultValue `undefined`
     */
    label?: string
    /**
     * An optional flag to indicate if the select is required.
     * If set to `true`, an asterisk will be displayed next to the label.
     * 
     * @defaultValue `false`
     */
    required?: boolean
  }
}