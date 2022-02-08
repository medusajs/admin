import clsx from "clsx"
import React from "react"

export const useHighlightSearch = (query: string) => {
  function getHighlightedSearch(text: string) {
    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return (
      <span>
        {parts.map((part: string, i: number) => (
          <span
            key={i}
            className={clsx({
              "bg-orange-10": part.toLowerCase() === query.toLowerCase(),
            })}
          >
            {part}
          </span>
        ))}
      </span>
    )
  }

  return { getHighlightedSearch }
}
