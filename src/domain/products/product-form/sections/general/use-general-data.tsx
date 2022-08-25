import { useAdminCollections, useAdminProductTypes } from "medusa-react"
import { useMemo } from "react"

const useGeneralData = () => {
  const { product_types } = useAdminProductTypes()
  const { collections } = useAdminCollections()

  const productTypeOptions = useMemo(() => {
    return (
      product_types?.map(({ id, value }) => ({
        value: id,
        label: value,
      })) || []
    )
  }, [product_types])

  const collectionOptions = useMemo(() => {
    return (
      collections?.map(({ id, title }) => ({
        value: id,
        label: title,
      })) || []
    )
  }, [collections])

  return {
    productTypeOptions,
    collectionOptions,
  }
}

export default useGeneralData
