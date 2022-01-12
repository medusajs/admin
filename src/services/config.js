import { QueryClient } from "react-query"

export let medusaUrl =
  process.env.GATSBY_MEDUSA_BACKEND_URL || "http://localhost:9000"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 90000,
      retry: 1,
    },
  },
})
