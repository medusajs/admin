export const removeNullish = (obj) =>
  Object.entries(obj).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {})
