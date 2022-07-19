import useSWR from "swr"
import Medusa from "../../services/api"
export const useMedusaQuery = (search: any) => {
  const fetcher = async () => {
    return Medusa.variants.listOutstock(search)
  }

  return useSWR(JSON.stringify(search), fetcher)
}
