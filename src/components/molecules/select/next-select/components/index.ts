import { AdjacentContainer, IndicatorsContainer, SelectContainer, ValueContainer } from "./containers"
import Control, { ClearIndicator, DropdownIndicator, LoadingIndicator } from "./control"
import Input from "./input"
import Menu, { LoadingMessage, MenuList, Option } from "./menu"
import MultiValue, { MultiValueContainer, MultiValueRemove } from "./multi-value"
import Placeholder from "./placeholder"
import SingleValue from "./single-value"

const Components = {
    ClearIndicator,
    DropdownIndicator,
    LoadingIndicator,
    SelectContainer,
    Control,
    Input,
    Placeholder,
    Menu,
    MenuList,
    Option,
    SingleValue,
    MultiValue,
    MultiValueContainer,
    MultiValueRemove,
    ValueContainer,
    IndicatorsContainer,
    LoadingMessage,
    IndicatorSeparator: null
}

export { AdjacentContainer }
export default Components
