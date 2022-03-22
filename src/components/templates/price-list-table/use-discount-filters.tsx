import { omit } from "lodash"
import qs from "qs"
import { useMemo, useReducer, useState } from "react"
import { relativeDateFormatToTimestamp } from "../../../utils/time"

type DiscountDateFilter = null | {
  gt?: string
  lt?: string
}

type DiscountFilterAction =
  | { type: "setQuery"; payload: string | null }
  | { type: "setFilters"; payload: DiscountFilterState }
  | { type: "reset"; payload: DiscountFilterState }
  | { type: "setOffset"; payload: number }
  | { type: "setDefaults"; payload: DiscountDefaultFilters | null }

interface DiscountFilterState {
  query?: string | null
  isDynamic: {
    open: boolean
    filter: null | string[]
  }
  date: {
    open: boolean
    filter: null | DiscountDateFilter
  }
  limit: number
  offset: number
  additionalFilters: DiscountDefaultFilters | null
}

const allowedFilters = [
  "status",
  "is_dynamic",
  "q",
  "created_at",
  "offset",
  "limit",
]

const DefaultTabs = {}

const formatDateFilter = (filter: DiscountDateFilter) => {
  if (filter === null) {
    return filter
  }

  const dateFormatted = Object.entries(filter).reduce((acc, [key, value]) => {
    if (value.includes("|")) {
      acc[key] = relativeDateFormatToTimestamp(value)
    } else {
      acc[key] = value
    }
    return acc
  }, {})

  return dateFormatted
}

const reducer = (
  state: DiscountFilterState,
  action: DiscountFilterAction
): DiscountFilterState => {
  switch (action.type) {
    case "setFilters": {
      return {
        ...state,
        query: action?.payload?.query,
        isDynamic: action.payload.isDynamic,
        date: action.payload.date,
      }
    }
    case "setQuery": {
      return {
        ...state,
        query: action.payload,
      }
    }
    case "setOffset": {
      return {
        ...state,
        offset: action.payload,
      }
    }
    case "reset": {
      return action.payload
    }
    default: {
      return state
    }
  }
}

type DiscountDefaultFilters = {
  expand?: string
  fields?: string
}

const eqSet = (as: Set<string>, bs: Set<string>) => {
  if (as.size !== bs.size) {
    return false
  }
  for (const a of as) {
    if (!bs.has(a)) {
      return false
    }
  }
  return true
}

export const useDiscountFilters = (
  existing?: string,
  defaultFilters: DiscountDefaultFilters | null = null
) => {
  if (existing && existing[0] === "?") {
    existing = existing.substring(1)
  }

  const initial = useMemo(() => parseQueryString(existing, defaultFilters), [
    existing,
    defaultFilters,
  ])

  const initialTabs = useMemo(() => {
    const storageString = localStorage.getItem("discounts::filters")
    if (storageString) {
      const savedTabs = JSON.parse(storageString)

      if (savedTabs) {
        return Object.entries(savedTabs).map(([key, value]) => {
          return {
            label: key,
            value: key,
            removable: true,
            representationString: value,
          }
        })
      }
    }

    return []
  }, [])

  const [state, dispatch] = useReducer(reducer, initial)
  const [tabs, setTabs] = useState(initialTabs)

  const setDefaultFilters = (filters: DiscountDefaultFilters | null) => {
    dispatch({ type: "setDefaults", payload: filters })
  }

  const paginate = (direction: 1 | -1) => {
    if (direction > 0) {
      const nextOffset = state.offset + state.limit

      dispatch({ type: "setOffset", payload: nextOffset })
    } else {
      const nextOffset = Math.max(state.offset - state.limit, 0)
      dispatch({ type: "setOffset", payload: nextOffset })
    }
  }

  const reset = () => {
    dispatch({
      type: "setFilters",
      payload: {
        ...state,
        offset: 0,
        date: {
          open: false,
          filter: null,
        },
        isDynamic: {
          open: false,
          filter: ["normal"],
        },
        query: null,
      },
    })
  }

  const setFilters = (filters: DiscountFilterState) => {
    dispatch({ type: "setFilters", payload: filters })
  }

  const setQuery = (queryString: string | null) => {
    dispatch({ type: "setQuery", payload: queryString })
  }

  const getQueryObject = () => {
    const toQuery: any = { ...state.additionalFilters }
    for (const [key, value] of Object.entries(state)) {
      if (key === "query") {
        if (value && typeof value === "string") {
          toQuery["q"] = value
        }
      } else if (key === "offset" || key === "limit") {
        toQuery[key] = value
      } else if (value.open) {
        if (key === "date") {
          toQuery[stateFilterMap[key]] = formatDateFilter(
            value.filter as DiscountDateFilter
          )
        } else if (key === "isDynamic") {
          const types = value.filter
          if (types && types.includes("normal") && types.includes("dynamic")) {
            // noop
          } else if (types.includes("normal")) {
            toQuery[stateFilterMap[key]] = false
          } else if (types.includes("dynamic")) {
            toQuery[stateFilterMap[key]] = true
          } else {
            toQuery[stateFilterMap[key]] = false
          }
        } else {
          toQuery[stateFilterMap[key]] = value.filter
        }
      }
    }

    return toQuery
  }

  const getQueryString = () => {
    const obj = getQueryObject()
    return qs.stringify(obj, { skipNulls: true })
  }

  const getRepresentationObject = (fromObject?: DiscountFilterState) => {
    const objToUse = fromObject ?? state

    const toQuery: any = {}
    for (const [key, value] of Object.entries(objToUse)) {
      if (key === "query") {
        if (value && typeof value === "string") {
          toQuery["q"] = value
        }
      } else if (key === "isDynamic") {
        const types = value.filter
        if (types && types.includes("normal") && types.includes("dynamic")) {
          toQuery[stateFilterMap[key]] = "all"
        } else if (types.includes("normal")) {
          toQuery[stateFilterMap[key]] = false
        } else if (types.includes("dynamic")) {
          toQuery[stateFilterMap[key]] = true
        } else {
          toQuery[stateFilterMap[key]] = false
        }
      } else if (key === "offset" || key === "limit") {
        toQuery[key] = value
      } else if (value.open) {
        toQuery[stateFilterMap[key]] = value.filter
      }
    }

    return toQuery
  }

  const getRepresentationString = () => {
    const obj = getRepresentationObject()
    return qs.stringify(obj, { skipNulls: true })
  }

  const queryObject = useMemo(() => getQueryObject(), [state])
  const representationObject = useMemo(() => getRepresentationObject(), [state])
  const representationString = useMemo(() => getRepresentationString(), [state])

  const activeFilterTab = useMemo(() => {
    const clean = omit(representationObject, ["limit", "offset"])
    const stringified = qs.stringify(clean)

    const existsInSaved = tabs.find(
      (el) => el.representationString === stringified
    )
    if (existsInSaved) {
      return existsInSaved.value
    }

    for (const [tab, conditions] of Object.entries(DefaultTabs)) {
      let match = true

      if (Object.keys(clean).length !== Object.keys(conditions).length) {
        continue
      }

      for (const [filter, value] of Object.entries(conditions)) {
        if (filter in clean) {
          if (Array.isArray(value)) {
            match =
              Array.isArray(clean[filter]) &&
              eqSet(new Set(clean[filter]), new Set(value))
          } else {
            match = clean[filter] === value
          }
        } else {
          match = false
        }

        if (!match) {
          break
        }
      }

      if (match) {
        return tab
      }
    }

    return null
  }, [representationObject, tabs])

  const availableTabs = useMemo(() => {
    return [...tabs]
  }, [tabs])

  const setTab = (tabName: string) => {
    let tabToUse: object | null = null
    if (tabName in DefaultTabs) {
      tabToUse = DefaultTabs[tabName]
    } else {
      const tabFound = tabs.find((t) => t.value === tabName)
      if (tabFound) {
        tabToUse = qs.parse(tabFound.representationString)
      }
    }

    if (tabToUse) {
      const toSubmit = {
        ...state,
        date: {
          open: false,
          filter: null,
        },
        isDynamic: {
          open: false,
          filter: ["normal"],
        },
      }

      for (const [filter, val] of Object.entries(tabToUse)) {
        toSubmit[filterStateMap[filter]] = {
          open: true,
          filter: val,
        }
      }
      dispatch({ type: "setFilters", payload: toSubmit })
    }
  }

  const saveTab = (tabName: string, filters: DiscountFilterState) => {
    const repObj = getRepresentationObject({ ...filters })
    const clean = omit(repObj, ["limit", "offset"])
    const repString = qs.stringify(clean, { skipNulls: true })

    const storedString = localStorage.getItem("discounts::filters")

    let existing: null | object = null

    if (storedString) {
      existing = JSON.parse(storedString)
    }

    if (existing) {
      existing[tabName] = repString
      localStorage.setItem("discounts::filters", JSON.stringify(existing))
    } else {
      const newFilters = {}
      newFilters[tabName] = repString
      localStorage.setItem("discounts::filters", JSON.stringify(newFilters))
    }

    setTabs((prev) => {
      return [
        ...prev,
        {
          label: tabName,
          value: tabName,
          representationString: repString,
          removable: true,
        },
      ]
    })

    dispatch({ type: "setFilters", payload: filters })
  }

  const removeTab = (tabValue: string) => {
    const storedString = localStorage.getItem("discounts::filters")

    let existing: null | object = null

    if (storedString) {
      existing = JSON.parse(storedString)
    }

    if (existing) {
      delete existing[tabValue]
      localStorage.setItem("discounts::filters", JSON.stringify(existing))
    }

    setTabs((prev) => {
      const newTabs = prev.filter((p) => p.value !== tabValue)
      return newTabs
    })
  }

  return {
    ...state,
    filters: {
      ...state,
    },
    removeTab,
    saveTab,
    setTab,
    availableTabs,
    activeFilterTab,
    representationObject,
    representationString,
    queryObject,
    paginate,
    getQueryObject,
    getQueryString,
    setQuery,
    setFilters,
    setDefaultFilters,
    reset,
  }
}

const filterStateMap = {
  is_dynamic: "isDynamic",
  created_at: "date",
}

const stateFilterMap = {
  isDynamic: "is_dynamic",
  date: "created_at",
}

const parseQueryString = (
  queryString?: string,
  additionals: DiscountDefaultFilters | null = null
): DiscountFilterState => {
  const defaultVal: DiscountFilterState = {
    date: {
      open: false,
      filter: null,
    },
    isDynamic: {
      open: false,
      filter: ["normal"],
    },
    offset: 0,
    limit: 15,
    additionalFilters: additionals,
  }

  if (queryString) {
    const filters = qs.parse(queryString)
    for (const [key, value] of Object.entries(filters)) {
      if (allowedFilters.includes(key)) {
        switch (key) {
          case "is_dynamic": {
            if (typeof value === "string") {
              if (value === "true") {
                defaultVal.isDynamic = {
                  open: true,
                  filter: ["dynamic"],
                }
              } else if (value === "false") {
                defaultVal.isDynamic = {
                  open: true,
                  filter: ["normal"],
                }
              } else if (value === "all") {
                defaultVal.isDynamic = {
                  open: true,
                  filter: ["normal", "dynamic"],
                }
              }
            }
            break
          }
          case "offset": {
            if (typeof value === "string") {
              defaultVal.offset = parseInt(value)
            }
            break
          }
          case "created_at": {
            defaultVal.date = {
              open: true,
              filter: value,
            }
            break
          }
          case "limit": {
            if (typeof value === "string") {
              defaultVal.limit = parseInt(value)
            }
            break
          }
          case "q": {
            if (typeof value === "string") {
              defaultVal.query = value
            }
            break
          }
          default: {
            break
          }
        }
      }
    }
  }

  return defaultVal
}
