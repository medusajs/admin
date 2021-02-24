export const dateToUnixTimestamp = date => {
  if (date instanceof Date) {
    return (date.getTime() / 1000).toFixed(0)
  }
  return null
}
