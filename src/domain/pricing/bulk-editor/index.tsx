import React, { useState } from "react"
import clsx from "clsx"

import { Product, ProductVariant } from "@medusajs/medusa"

import Fade from "../../../components/atoms/fade-wrapper"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import NativeSelect from "../../../components/molecules/native-select"
import TableFieldsFilters from "../../../components/molecules/table-fileds-filter"
import TableSearch from "../../../components/molecules/table/table-search"
import { currencies, CurrencyType } from "../../../utils/currencies"
import PriceInput from "../../../components/organisms/price-input"
import ImagePlaceholder from "../../../components/fundamentals/image-placeholder"
import { string } from "prop-types"

function generateField(currency: CurrencyType) {
  return {
    id: currency.code,
    short: `Price: ${currency.code}`,
    label: ({ isSelected }) => (
      <span className="text-small text-grey-50">
        <span className={clsx("text-grey-90", { "font-semibold": isSelected })}>
          Price:{" "}
        </span>
        {currency.code}
      </span>
    ),
  }
}
type PriceListBulkEditorHeaderProps = {
  setCurrencyFields: (a: string[]) => void
}

function PriceListBulkEditorHeader(props: PriceListBulkEditorHeaderProps) {
  const { setCurrencyFields } = props
  return (
    <div className="flex justify-center my-[30px]">
      <div className="medium:w-8/12 w-full px-8 flex justify-between">
        <div className="flex items-start">
          <div className="flex shrink-0 items-center mt-1">
            <span className="text-small font-semibold text-grey-50">
              Price list:
            </span>

            <NativeSelect defaultValue="TODO 1">
              <NativeSelect.Item value="TODO 1">TODO 1</NativeSelect.Item>
              <NativeSelect.Item value="TODO 2">TODO 2</NativeSelect.Item>
            </NativeSelect>
          </div>

          <div className="ml-8">
            <TableFieldsFilters
              fields={Object.keys(currencies).map((k) =>
                generateField(currencies[k])
              )}
              onChange={setCurrencyFields}
            />
          </div>
        </div>

        <div className="shrink-0">
          <TableSearch />
        </div>
      </div>
    </div>
  )
}

type TileProps = {
  className?: string
  children: React.ReactNode
}

function Tile(props: TileProps) {
  return (
    <div
      className={`
        border border-solid border-grey-20
        h-[40px]
        min-w-[314px]
        rounded-lg
        bg-grey-5
        text-gray-90
        text-small
        flex items-center
        pl-3
        ${props.className || ""}`}
    >
      {props.children}
    </div>
  )
}

type ProductSectionHeaderProps = {
  product: Product
  isFirst: boolean
  currencyFields: string[]
}

function ProductSectionHeader(props: ProductSectionHeaderProps) {
  const { currencyFields, product, isFirst } = props
  return (
    <>
      {isFirst && (
        <div className="flex mb-2 gap-2">
          <div className="min-w-[314px]">
            <span className="text-small font-semibold text-grey-50">
              Product title:
            </span>
          </div>
          <div className="min-w-[314px]">
            <span className="text-small font-semibold text-grey-50">SKU</span>
          </div>
          {currencyFields.map((c) => (
            <div className="min-w-[314px]">
              <span className="text-small font-semibold text-grey-50">{c}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex mb-2 gap-2">
        <div className="min-w-[314px]">
          <Tile>
            <div className="flex items-center">
              <div className="h-[40px] w-[30px] flex items-center">
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    className="w-[18px] h-[24px] object-cover rounded-soft"
                  />
                ) : (
                  <div className="flex items-center w-[18px] h-[24px] rounded-soft bg-grey-10">
                    <ImagePlaceholder size={18} />
                  </div>
                )}
              </div>
              <span className="text-small text-gray-90 ">{product.title}</span>
            </div>
          </Tile>
        </div>
        <div className="min-w-[314px]">
          <span className="text-small font-semibold text-grey-50">
            <Tile>-</Tile>
          </span>
        </div>
        {currencyFields.map((c) => (
          <div className="min-w-[314px]">
            <span className="text-small font-semibold text-grey-50">
              <Tile>-</Tile>
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

type ProductSectionProps = {
  product: Product
  isFirst: boolean
  currencyFields: string[]
}

function ProductSection(props: ProductSectionProps) {
  const { currencyFields, product, isFirst } = props
  const [activeFields, setActiveFields] = useState({})
  const [currentEditAmount, setCurrentEditAmount] = useState<string>()

  const onPriceInputFocus = (variantId: string, currency: string) => {
    setActiveFields({ ...activeFields, [`${variantId}-${currency}`]: true })
  }

  const onPriceInputBlur = (variantId: string, currency: string) => {
    // const tmp = { ...activeFields }
    // delete tmp[`${variantId}-${currency}`]
    //
    // setActiveFields(tmp)
  }

  const onAmountChange = (
    variantId: string,
    currency: string,
    amount: string
  ) => {
    setCurrentEditAmount(amount)
  }

  const isActive = (variantId: string, currency: string) =>
    activeFields[`${variantId}-${currency}`]

  return (
    <div className="medium:w-8/12 w-full px-8 m-auto mb-4">
      <ProductSectionHeader
        isFirst={isFirst}
        product={product}
        currencyFields={currencyFields}
      />
      {product.variants.map((v) => (
        <ProductVariantRow
          key={v.id}
          variant={v}
          isActive={isActive}
          onPriceInputFocus={onPriceInputFocus}
          onPriceInputBlur={onPriceInputBlur}
          onAmountChange={onAmountChange}
          currentEditAmount={currentEditAmount}
          currencyFields={currencyFields}
        />
      ))}
    </div>
  )
}

type ProductVariantRowProps = {
  variant: ProductVariant
  currencyFields: string[]

  isActive: (variantId: string, currency: string) => boolean

  currentEditAmount: number
  onAmountChange: (variantId: string, currency: string, amount: string) => void
  onPriceInputFocus: (variantId: string, currency: string) => void
  onPriceInputBlur: (variantId: string, currency: string) => void
}

function ProductVariantRow(props: ProductVariantRowProps) {
  const {
    currentEditAmount,
    currencyFields,
    variant,
    onPriceInputBlur,
    onPriceInputFocus,
    onAmountChange,
    isActive,
  } = props

  return (
    <div className="flex gap-2 mb-2">
      <Tile>{variant.title}</Tile>
      <Tile>{variant.sku}</Tile>

      {currencyFields.map((c) => {
        const current = variant.prices.find(
          (p) => p.currency_code === c.toLowerCase()
        )

        return (
          <div key={c} className="min-w-[314px]">
            <PriceInput
              hasVirtualFocus={isActive(variant.id, c)}
              amount={
                isActive(variant.id, c) ? currentEditAmount : current?.amount
              }
              onFocus={() => onPriceInputFocus(variant.id, c)}
              onBlur={() => onPriceInputBlur(variant.id, c)}
              currency={currencies[c]}
              onAmountChange={(a) => onAmountChange(variant.id, c, a)}
            />
          </div>
        )
      })}
    </div>
  )
}

type PriceListBulkEditorProps = {
  products: Product[]
}

function PriceListBulkEditor(props: PriceListBulkEditorProps) {
  const { products } = props
  const [currencyFields, setCurrencyFields] = useState<string[]>([])

  return (
    <Fade isVisible isFullScreen={true}>
      <FocusModal>
        <FocusModal.Header>
          <div className="medium:w-8/12 w-full px-8 flex justify-between">
            <div className="flex items-center gap-4">
              <Button
                size="small"
                variant="ghost"
                // onClick={closeForm}
                className="border rounded-rounded w-8 h-8"
              >
                <CrossIcon size={20} />
              </Button>
              <span className="font-semibold text-grey-90 text-large">
                Bulk editor
              </span>
            </div>
            <div className="gap-x-small flex">
              <Button
                // onClick={handleSubmit(submitGhost)}
                size="small"
                variant="ghost"
                className="border rounded-rounded"
              >
                Discard
              </Button>
              <Button
                size="small"
                // variant="primary"
                // onClick={handleSubmit(submitCTA)}
                className="rounded-rounded"
              >
                Save
              </Button>
            </div>
          </div>
        </FocusModal.Header>

        <FocusModal.Main>
          <PriceListBulkEditorHeader setCurrencyFields={setCurrencyFields} />

          {products.map((p, ind) => (
            <ProductSection
              key={p.id}
              product={p}
              isFirst={!ind}
              currencyFields={currencyFields.sort()}
            />
          ))}
        </FocusModal.Main>
      </FocusModal>
    </Fade>
  )
}

export default PriceListBulkEditor
