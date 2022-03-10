import { useEffect } from "react"

/**
 * Effect hook which reflects `queryObject` k/v in the url.
 */
function useSetSearchParams(queryObject: Record<string, string>) {
  useEffect(() => {
    const url = new URL(window.location.href)

    Object.entries(queryObject).forEach(([k, v]) => url.searchParams.set(k, v))

    window.history.replaceState(null, "", url.toString())
  }, [queryObject])
}

export default useSetSearchParams
