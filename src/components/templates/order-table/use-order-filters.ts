import { useMemo, useReducer } from "react"
import qs from "qs"
import { relativeDateFormatToTimestamp } from "../../../utils/time"

type OrderDateFilter = null | {
  gt?: string
  lt?: string
}

type OrderFilterAction =
  | { type: "setQuery"; payload: string | null }
  | { type: "setFilters"; payload: OrderFilterState }
  | { type: "reset"; payload: OrderFilterState }
  | { type: "setOffset"; payload: number }
  | { type: "setDefaults"; payload: OrderDefaultFilters | null }
  | { type: "setDate"; payload: OrderDateFilter }
  | { type: "setStatus"; payload: null | string[] | string }
  | { type: "setFulfillment"; payload: null | string[] | string }
  | { type: "setPayment"; payload: null | string[] | string }

interface OrderFilterState {
  query?: string | null
  status: {
    open: boolean
    filter: null | string[] | string
  }
  fulfillment: {
    open: boolean
    filter: null | string[] | string
  }
  payment: {
    open: boolean
    filter: null | string[] | string
  }
  date: {
    open: boolean
    filter: OrderDateFilter
  }
  limit: number
  offset: number
  additionalFilters: OrderDefaultFilters | null
}

const allowedFilters = [
  "status",
  "fulfillment_status",
  "payment_status",
  "created_at",
  "q",
  "offset",
  "limit",
]

const formatDateFilter = (filter: OrderDateFilter) => {
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
  state: OrderFilterState,
  action: OrderFilterAction
): OrderFilterState => {
  switch (action.type) {
    case "setFilters": {
      return {
        ...state,
        fulfillment: action.payload.fulfillment,
        payment: action.payload.payment,
        status: action.payload.status,
        date: action.payload.date,
      }
    }
    case "setQuery": {
      return {
        ...state,
        query: action.payload,
      }
    }
    case "setDate": {
      const newDateFilters = state.date
      return {
        ...state,
        date: newDateFilters,
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

type OrderDefaultFilters = {
  expand?: string
  fields?: string
}

export const useOrderFilters = (
  existing?: string,
  defaultFilters: OrderDefaultFilters | null = null
) => {
  if (existing && existing[0] === "?") {
    existing = existing.substring(1)
  }
  const initial = useMemo(() => parseQueryString(existing, defaultFilters), [
    existing,
    defaultFilters,
  ])

  const [state, dispatch] = useReducer(reducer, initial)

  const setDateFilter = (filter: OrderDateFilter | null) => {
    dispatch({ type: "setDate", payload: filter })
  }

  const setFulfillmentFilter = (filter: string[] | string | null) => {
    dispatch({ type: "setFulfillment", payload: filter })
  }

  const setPaymentFilter = (filter: string[] | string | null) => {
    dispatch({ type: "setPayment", payload: filter })
  }

  const setStatusFilter = (filter: string[] | string | null) => {
    dispatch({ type: "setStatus", payload: filter })
  }

  const setDefaultFilters = (filters: OrderDefaultFilters | null) => {
    dispatch({ type: "setDefaults", payload: filters })
  }

  const paginate = (direction: 1 | -1) => {
    if (direction > 0) {
      const nextOffset = state.offset + state.limit

      dispatch({ type: "setOffset", payload: nextOffset })
    } else {
      const nextOffset = Math.min(state.offset - state.limit, 0)
      dispatch({ type: "setOffset", payload: nextOffset })
    }
  }

  const reset = () => {
    dispatch({
      type: "setFilters",
      payload: {
        ...state,
        offset: 0,
        payment: {
          open: false,
          filter: null,
        },
        fulfillment: {
          open: false,
          filter: null,
        },
        status: {
          open: false,
          filter: null,
        },
        date: {
          open: false,
          filter: null,
        },
      },
    })
  }

  const setFilters = (filters: OrderFilterState) => {
    dispatch({ type: "setFilters", payload: filters })
  }

  const setQuery = (queryString: string | null) => {
    dispatch({ type: "setQuery", payload: queryString })
  }

  const getQueryObject = () => {
    const toQuery: any = { ...state.additionalFilters }
    for (const [key, value] of Object.entries(state)) {
      if (key === "query" && typeof value === "string") {
        toQuery["q"] = value
      } else if (key === "offset" || key === "limit") {
        toQuery[key] = value
      } else if (value.open) {
        if (key === "date") {
          toQuery[stateFilterMap[key]] = formatDateFilter(
            value.filter as OrderDateFilter
          )
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

  const getRepresentationObject = () => {
    const toQuery: any = {}
    for (const [key, value] of Object.entries(state)) {
      if (key === "query" && typeof value === "string") {
        toQuery["q"] = value
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

  const queryObject = useMemo(() => getQueryObject(state), [state])
  const representationObject = useMemo(() => getRepresentationObject(), [state])
  const representationString = useMemo(() => getRepresentationString(), [state])

  return {
    ...state,
    filters: {
      ...state,
    },
    representationObject,
    representationString,
    queryObject,
    paginate,
    getQueryObject,
    getQueryString,
    setQuery,
    setFilters,
    setDefaultFilters,
    setDateFilter,
    setFulfillmentFilter,
    setPaymentFilter,
    setStatusFilter,
    reset,
  }
}

const stateFilterMap = {
  status: "status",
  fulfillment: "fulfillment_status",
  payment: "payment_status",
  date: "created_at",
}

const parseQueryString = (
  queryString?: string,
  additionals: OrderDefaultFilters | null = null
): OrderFilterState => {
  const defaultVal: OrderFilterState = {
    status: {
      open: false,
      filter: null,
    },
    fulfillment: {
      open: false,
      filter: null,
    },
    payment: {
      open: false,
      filter: null,
    },
    date: {
      open: false,
      filter: null,
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
          case "offset": {
            if (typeof value === "string") {
              defaultVal.offset = parseInt(value)
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
          case "status": {
            if (typeof value === "string" || Array.isArray(value)) {
              defaultVal.status = {
                open: true,
                filter: value,
              }
            }
            break
          }
          case "fulfillment_status": {
            if (typeof value === "string" || Array.isArray(value)) {
              defaultVal.fulfillment = {
                open: true,
                filter: value,
              }
            }
            break
          }
          case "payment_status": {
            if (typeof value === "string" || Array.isArray(value)) {
              defaultVal.payment = {
                open: true,
                filter: value,
              }
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
          default: {
            break
          }
        }
      }
    }
  }

  return defaultVal
}
