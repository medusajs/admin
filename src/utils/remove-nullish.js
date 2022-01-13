export const removeNullish = obj => 
  Object.entries(obj).reduce((a, [k, v]) => ((v || v === 0) ? ((a[k] = v), a) : a), {})
  
