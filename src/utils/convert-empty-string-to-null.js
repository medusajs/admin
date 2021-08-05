export const convertEmptyStringToNull = (data, fields) => {
  const obj = { ...data }
  Object.keys(data).forEach(k => {
    if (fields.includes(k) && obj[k] === "") {
      obj[k] = null
    }
  })
  return obj
}
