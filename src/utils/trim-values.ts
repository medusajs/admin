export const trimValues = (obj: object) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].trim()
    }
  })

  return obj
}
