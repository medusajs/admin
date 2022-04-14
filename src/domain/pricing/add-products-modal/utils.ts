import { difference } from "lodash"
import { Idable } from "../../../types/shared"

export const refreshItems = <T extends Idable>(
  selectedItems: T[] = [],
  ids: string[] = [],
  source: T[] = []
) => {
  const selectedItemIds = selectedItems.map((item) => item?.id)
  const fresh = selectedItems.slice()
  if (selectedItems.length < ids.length) {
    const added = difference(ids, selectedItemIds)
    const newItems = added.map((id) => source.find((s) => s.id === id)) as T[]
    newItems.forEach((item) => fresh.push(item))
  } else if (selectedItems.length > ids.length) {
    const removed = difference(selectedItemIds, ids)
    removed.forEach((id) => {
      const index = selectedItemIds.findIndex((itemId) => itemId === id)
      fresh.splice(index, 1)
    })
  }
  return fresh
}
