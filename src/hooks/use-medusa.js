import React, { useState, useEffect } from "react"
import { useToasts } from "react-toast-notifications"

import Medusa from "../services/api"
import ToastLabel from "../components/toast"

const useMedusa = (endpoint, query) => {
  const [isLoading, setLoading] = useState(true)
  const [isReloading, setReloading] = useState(false)
  const [didFail, setDidFail] = useState(false)
  const [result, setResult] = useState({})

  const { addToast } = useToasts()

  const subcomponent = Medusa[endpoint]
  if (!subcomponent) {
    throw Error(`Endpoint: "${endpoint}", does not exist`)
  }

  const fetchData = async (refresh, query, offset, limit) => {
    if (!refresh) {
      setLoading(true)
    } else {
      setReloading(true)
    }
    try {
      if (!query) {
        if (subcomponent.list) {
          const { data } = await subcomponent.list()
          setResult(data)
          setLoading(false)
          setReloading(false)
        } else {
          const { data } = await subcomponent.retrieve()
          setResult(data)
          setLoading(false)
          setReloading(false)
        }
      } else if (query.id) {
        const { data } = await subcomponent.retrieve(query.id)
        setResult(data)
        setLoading(false)
        setReloading(false)
      } else if (!query.id) {
        const { data } = await subcomponent.list(query.search)
        setResult(data)
      }
      setLoading(false)
      setReloading(false)
    } catch (error) {
      setDidFail(true)
      setLoading(false)
      setReloading(false)
    }
  }

  const toaster = (text, type) => {
    return addToast(<ToastLabel>{text}</ToastLabel>, { appearance: type })
  }

  useEffect(() => {
    fetchData(false, query)
  }, [])

  let value = {
    ...result,
    refresh: query => fetchData(true, query),
    isLoading,
    isReloading,
    toaster,
    didFail,
  }

  if (subcomponent.update && query && query.id) {
    value.update = updateData =>
      subcomponent.update(query.id, updateData).then(({ data }) => {
        setResult(data)
      })
  }

  if (subcomponent.delete && query && query.id) {
    value.delete = () => subcomponent.delete(query.id)
  }

  switch (endpoint) {
    case "orders":
      if (query && query.id) {
        value.capturePayment = () => {
          return subcomponent.capturePayment(query.id).then(({ data }) => {
            setResult(data)
          })
        }

        value.archive = () => {
          return subcomponent.archive(query.id).then(({ data }) => {
            setResult(data)
          })
        }

        value.complete = () => {
          return subcomponent.complete(query.id).then(({ data }) => {
            setResult(data)
          })
        }

        value.refund = payload => {
          return subcomponent
            .refund(query.id, payload)
            .then(({ data }) => setResult(data))
        }

        value.createShipment = payload => {
          return subcomponent
            .createShipment(query.id, payload)
            .then(({ data }) => setResult(data))
        }

        value.createFulfillment = payload => {
          return subcomponent
            .createFulfillment(query.id, payload)
            .then(({ data }) => setResult(data))
        }

        value.requestReturn = payload => {
          return subcomponent
            .requestReturn(query.id, payload)
            .then(({ data }) => setResult(data))
        }

        value.receiveReturn = (returnId, payload) => {
          return subcomponent
            .receiveReturn(query.id, returnId, payload)
            .then(({ data }) => setResult(data))
        }

        value.cancel = () => {
          return subcomponent
            .cancel(query.id)
            .then(({ data }) => setResult(data))
        }
      }
      break
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
    case "products":
      if (query && query.id) {
        const variantMethods = {
          create: variant => {
            return subcomponent.variants
              .create(query.id, variant)
              .then(({ data }) => {
                setResult(data)
              })
          },
          retrieve: variantId => {
            return subcomponent.variants
              .retrieve(query.id, variantId)
              .then(({ data }) => {
                setResult(data)
              })
          },
          update: (variantId, update) => {
            return subcomponent.variants
              .update(query.id, variantId, update)
              .then(({ data }) => {
                setResult(data)
              })
          },
          delete: variantId => {
            return subcomponent.variants
              .delete(query.id, variantId)
              .then(({ data }) => {
                setResult(data)
              })
          },
          list: () => {
            return subcomponent.variants.delete(query.id)
          },
        }
        value.variants = variantMethods

        const optionMethods = {
          create: option => {
            return subcomponent.options
              .create(query.id, option)
              .then(({ data }) => {
                setResult(data)
              })
          },
          update: (optionId, update) => {
            return subcomponent.options
              .update(query.id, optionId, update)
              .then(({ data }) => {
                setResult(data)
              })
          },
          delete: optionId => {
            return subcomponent.options
              .delete(query.id, optionId)
              .then(({ data }) => {
                setResult(data)
              })
          },
        }
        value.options = optionMethods
      }
      break
    case "regions":
      value.fulfillmentOptions = subcomponent.fulfillmentOptions
      break
    default:
      break
  }

  return value
}

export default useMedusa
