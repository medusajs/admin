export const range = (start, end) => {
  const range: number[] = []
  for (let i = start; i <= end; i++) {
    range.push(i)
  }
  return range
}

export const years = range(
  new Date().getFullYear() - 20,
  new Date().getFullYear() + 20
)

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
