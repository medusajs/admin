export const productCollectionToFormValuesMapper = (collection) => {
  let thumbnail = collection?.images?.length
    ? collection.images.findIndex((img) => img.url === collection.thumbnail)
    : 0
  thumbnail = thumbnail === -1 ? 0 : thumbnail

  return {
    ...collection,
    images: collection?.images?.length
      ? collection.images
      : collection?.thumbnail
      ? [{ url: collection?.thumbnail }]
      : [],
    thumbnail,
  }
}

export const formValuesToCreateUpdateProductCollectionMapper = (values) => {
  return {
    title: values.title,
    handle: values.handle,
    thumbnail: values.images.length
      ? values.images[values.thumbnail]
      : undefined,
    images: values?.images || [],
    metadata: values.metadata,
  }
}
