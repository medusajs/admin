export type Option = {
  value: string
  label: string
}

export enum ProductStatus {
  DRAFT = "draft",
  PROPOSED = "proposed",
  PUBLISHED = "published",
  REJECTED = "rejected",
}

export type DateFilter = null | {
  gt?: string
  lt?: string
}
