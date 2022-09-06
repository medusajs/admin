import { useAdminRegions } from "medusa-react"

export const useRegionsData = () => {
  const { regions } = useAdminRegions({})
}
