import { Option, ProductStatus } from "../../../../types/shared"

export type ProductOption = {
  name: string
  values: string[]
}

export type VariantFormValues = {
  title: string | null
  sku: string | null
  ean: string | null
  inventory_quantity: number | null
  options: {
    value: string
  }[]
}

export type PriceFormValue = {
  price: {
    currency_code: string
    amount: number
  }
}

export type FormImage = {
  url: string
  name?: string
  size?: number
  nativeFile?: File
}

export type ProductFormValues = {
  title: string
  handle: string | null
  description: string | null
  collection: Option | null
  type: Option | null
  tags: string[]
  discountable: boolean
  sku?: string | null
  ean?: string | null
  inventory_quantity?: number | null
  allow_backorder?: boolean
  manage_inventory?: boolean
  width: number | null
  length: number | null
  weight: number | null
  height: number | null
  material: string | null
  origin_country: Option | null
  mid_code: string | null
  hs_code: string | null
  variants: VariantFormValues[]
  prices?: PriceFormValue[] | null
  thumbnail: number | null
  images: FormImage[]
  options: ProductOption[]
  status: ProductStatus | null
}
