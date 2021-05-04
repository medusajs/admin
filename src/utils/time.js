import moment from "moment"

export const getToday = () => {
  let value = Date.now()
  value = atMidnight(value)
  let day = dateToUnixTimestamp(value.toDate())
  let nextDay = dateToUnixTimestamp(addHours(value, 24).toDate())
  return { gt: day, lt: nextDay }
}

export const backInTime = daysBack => {
  let now = new Date()
  now.setDate(now.getDate() - daysBack)
  now = atMidnight(now)
  now = dateToUnixTimestamp(now.toDate())
  return now
}

export const dateToUnixTimestamp = date => {
  if (date instanceof Date) {
    return (date.getTime() / 1000).toFixed(0)
  }
  return null
}

export const atMidnight = date => {
  let result = moment(date)
  if (!moment.isMoment(result)) {
    console.log("date is not instance of Moment: ", date)
    return null
  }
  result.hour(0)
  result.minute(0)
  result.second(0)
  result.millisecond(0)

  return result
}

export const addHours = (date, hours) => {
  return moment(date)?.add(hours, "hours")
}

/**
 * The format is: [gt]=number|option
 * e.g: [gt]=2|days
 * @param {*} value
 */

export const relativeDateFormatToTimestamp = value => {
  //let [modifier, value] = dateFormat.split("=")
  let [count, option] = value.split("|")

  // relative days are always subtract
  let date = moment()

  date.subtract(count, option)
  date = atMidnight(date)

  const result = `${date.format("X")}`

  return result
}

export const timeSince = date => {
  var seconds = Math.floor((new Date() - date) / 1000)

  var interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + " years"
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + " months"
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + " days"
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + " hours"
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + " minutes"
  }
  return Math.floor(seconds) + " seconds"
}
