import qs from "qs"
import { useMemo, useReducer } from "react"

/***********************************************/
/******************** TYPES ********************/
/***********************************************/

type DefaultFilters = {
  expand?: string
  fields?: string
}

interface FilterState {
  q?: string | null
  limit: number
  offset: number
  additionalFilters: DefaultFilters | null
}

enum Direction {
  Up = 1,
  Down = -1,
}

enum FilterActionType {
  SET_QUERY = "setQuery",
  SET_FILTERS = "setFilters",
  RESET = "reset",
  SET_OFFSET = "setOffset",
  SET_DEFAULTS = "setDefaults",
}

type FilterAction =
  | { type: FilterActionType.SET_QUERY; payload: string | null }
  | { type: FilterActionType.SET_FILTERS; payload: FilterState }
  | { type: FilterActionType.RESET; payload: FilterState }
  | { type: FilterActionType.SET_OFFSET; payload: number }
  | {
      type: FilterActionType.SET_DEFAULTS
      payload: DefaultFilters | null
    }

const DEFAULT_ALLOWED_PARAMS = ["q", "offset", "limit"]

/*************************************************/
/******************** HELPERS ********************/
/*************************************************/

function getRepresentationObject(state: FilterState) {
  const toQuery: any = {}
  for (const [key, value] of Object.entries(state)) {
    if (key === "q") {
      if (value && typeof value === "string") {
        toQuery["q"] = value
      }
    } else if (key === "offset" || key === "limit") {
      toQuery[key] = value
    }
  }

  return toQuery
}

function getQueryObject<T>(state: FilterState & T) {
  const toQuery: any = { ...state.additionalFilters }
  for (const [key, value] of Object.entries(state)) {
    if (key === "q") {
      if (value && typeof value === "string") {
        toQuery["q"] = value
      }
    } else if (key === "offset" || key === "limit") {
      toQuery[key] = value
    }
  }

  return toQuery
}

function parseQueryString(
  queryString?: string,
  additional: DefaultFilters | null = null
): FilterState {
  const defaultVal: FilterState = {
    offset: 0,
    limit: 15,
    additionalFilters: additional,
  }

  if (!queryString) return defaultVal

  const filters = qs.parse(queryString)

  for (const [key, value] of Object.entries(filters)) {
    if (typeof value !== "string") continue

    if (DEFAULT_ALLOWED_PARAMS.includes(key)) {
      switch (key) {
        case "offset":
        case "limit":
          defaultVal[key] = parseInt(value)
          break
        case "q":
          defaultVal.q = value
          break
      }
    }
  }

  return defaultVal
}

/**********************************************************/
/******************** USE FILTERS HOOK ********************/
/**********************************************************/

/**
 * State reducer for the filters hook.
 */
function reducer(state: FilterState, action: FilterAction): FilterState {
  if (action.type === FilterActionType.SET_FILTERS)
    return { ...state, q: action?.payload?.q }

  if (action.type === FilterActionType.SET_QUERY)
    return { ...state, q: action.payload }

  if (action.type === FilterActionType.SET_OFFSET)
    return { ...state, offset: action.payload }

  if (action.type === FilterActionType.RESET) return action.payload

  return state
}

/**
 * Hook helper for parsing query string.
 *
 * @param defaultFilters
 */
function useQueryFilters<T>(
  defaultFilters: (DefaultFilters & T) | null = null
) {
  const searchString = location.search.substring(1)

  const [state, dispatch] = useReducer(
    reducer,
    parseQueryString(searchString, defaultFilters)
  )

  const setDefaultFilters = (filters: DefaultFilters | null) => {
    dispatch({ type: FilterActionType.SET_DEFAULTS, payload: filters })
  }

  const paginate = (direction: Direction) => {
    if (direction === Direction.Up) {
      const nextOffset = state.offset + state.limit

      dispatch({ type: FilterActionType.SET_OFFSET, payload: nextOffset })
    } else {
      const nextOffset = Math.max(state.offset - state.limit, 0)
      dispatch({ type: FilterActionType.SET_OFFSET, payload: nextOffset })
    }
  }

  const reset = () =>
    dispatch({
      type: FilterActionType.SET_FILTERS,
      payload: {
        ...state,
        offset: 0,
        q: null,
      },
    })

  const setFilters = (filters: FilterState) =>
    dispatch({ type: FilterActionType.SET_FILTERS, payload: filters })

  const setQuery = (queryString: string | null) =>
    dispatch({ type: FilterActionType.SET_QUERY, payload: queryString })

  const getQueryString = () =>
    qs.stringify(getQueryObject(state), { skipNulls: true })

  const getRepresentationString = () => {
    const obj = getRepresentationObject(state)
    return qs.stringify(obj, { skipNulls: true })
  }

  const queryObject = useMemo(() => getQueryObject(state), [state])
  const representationObject = useMemo(() => getRepresentationObject(state), [
    state,
  ])
  const representationString = useMemo(() => getRepresentationString(), [state])

  return {
    ...state,
    filters: {
      ...state,
    },
    representationObject,
    representationString,
    queryObject,
    // API
    paginate,
    getQueryObject,
    getQueryString,
    setQuery,
    setFilters,
    setDefaultFilters,
    reset,
  }
}

export default useQueryFilters
