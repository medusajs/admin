export const consolidateImages = (images, uploaded) => {
  const result: any[] = []
  let i = 0
  let j = 0
  for (i = 0; i < images.length; i++) {
    const image = images[i].url
    if (image.startsWith("blob")) {
      result.push(uploaded[j])
      j++
    } else {
      result.push(image)
    }
  }
  return result
}

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
