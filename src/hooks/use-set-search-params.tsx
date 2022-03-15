import { useEffect } from "react"

/**
 * Effect hook which reflects `queryObject` k/v in the url.
 */
function useSetSearchParams(queryObject: Record<string, string | number>) {
  useEffect(() => {
    const url = new URL(window.location.href)

    for (let k in queryObject) {
      url.searchParams.set(k, queryObject[k].toString())
    }

    window.history.replaceState(null, "", url.toString())
  }, [queryObject])
}

export default useSetSearchParams
