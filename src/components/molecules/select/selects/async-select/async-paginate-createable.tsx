import { ReactElement } from "react"
import type { GroupBase } from "react-select"
import type {
  ComponentProps,
  UseAsyncPaginateParams,
} from "react-select-async-paginate"
import { withAsyncPaginate } from "react-select-async-paginate"
import type { CreatableProps } from "react-select/creatable"
import Creatable from "react-select/creatable"

type AsyncPaginateCreatableProps<
  T,
  Group extends GroupBase<T>,
  Additional,
  IsMulti extends boolean
> = CreatableProps<T, IsMulti, Group> &
  UseAsyncPaginateParams<T, Group, Additional> &
  ComponentProps<T, Group, IsMulti>

type AsyncPaginateCreatableType = <
  T,
  Group extends GroupBase<T>,
  Additional,
  IsMulti extends boolean = false
>(
  props: AsyncPaginateCreatableProps<T, Group, Additional, IsMulti>
) => ReactElement

export const AsyncPaginateCreatable = withAsyncPaginate(
  Creatable
) as AsyncPaginateCreatableType
