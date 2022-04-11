type BuildOptionsMap = (product: any, variant?: any) => { [key: string]: any }

export const buildOptionsMap: BuildOptionsMap = (
  product,
  variant = { options: [] }
) => {
  const optionsMap = product?.options?.reduce((map, { title, id }) => {
    map[id] = { title, value: "", option_id: id }
    return map
  }, {})

  variant?.options?.forEach(({ option_id, ...option }) => {
    if (option_id) {
      optionsMap[option_id] = {
        ...optionsMap[option_id],
        option_id,
        ...option,
      }
    }
  })

  return optionsMap
}
