import React, { useState, useEffect } from "react"

import Medusa from "../services/api"

const useMedusa = (endpoint, query) => {
  const [isLoading, setLoading] = useState(true)
  const [result, setResult] = useState({})

  const subcomponent = Medusa[endpoint]
  if (!subcomponent) {
    throw Error(`Endpoint: "${endpoint}", does not exist`)
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      if (!query) {
        if (subcomponent.list) {
          const { data } = await subcomponent
            .list()
            .finally(() => setLoading(false))
          setResult(data)
        } else {
          const { data } = await subcomponent
            .retrieve()
            .finally(() => setLoading(false))
          setResult(data)
        }
      } else if (query.id) {
        const { data } = await subcomponent
          .retrieve(query.id)
          .finally(() => setLoading(false))
        setResult(data)
      } else if (!query.id && query.search) {
        const { data } = await subcomponent
          .list(query.search)
          .finally(() => setLoading(false))
        setResult(data)
      }
    }
    fetchData()
  }, [])

  let value = {
    ...result,
    isLoading,
  }

  switch (endpoint) {
    case "store":
      value.update = updateData => {
        return subcomponent.update(updateData).then(({ data }) => {
          setResult(data)
        })
      }
      value.addCurrency = code =>
        subcomponent.addCurrency(code).then(({ data }) => {
          setResult(data)
        })
      value.removeCurrency = code =>
        subcomponent.removeCurrency(code).then(({ data }) => {
          setResult(data)
        })
      break
    default:
      if (subcomponent.update && query && query.id) {
        value.update = updateData =>
          subcomponent.update(query.id, updateData).then(({ data }) => {
            setResult(data)
          })
      }
  }

  return value
}

export default useMedusa
