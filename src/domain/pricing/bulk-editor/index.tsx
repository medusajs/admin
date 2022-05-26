import React, { useEffect, useMemo, useRef, useState } from "react"
import { pick } from "lodash"
import clsx from "clsx"

import {
  useAdminCreatePriceListPrices,
  useAdminPriceListProducts,
  useAdminPriceLists,
  useAdminRegions,
} from "medusa-react"
import {
  MoneyAmount,
  PriceList,
  Product,
  ProductVariant,
  Region,
} from "@medusajs/medusa"

import Fade from "../../../components/atoms/fade-wrapper"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import NativeSelect from "../../../components/molecules/native-select"
import TableFieldsFilters from "../../../components/molecules/table-fields-filters"
import { currencies } from "../../../utils/currencies"
import PriceInput from "../../../components/organisms/price-input"
import ImagePlaceholder from "../../../components/fundamentals/image-placeholder"
import ArrowRightIcon from "../../../components/fundamentals/icons/arrow-right-icon"
import ArrowLeftIcon from "../../../components/fundamentals/icons/arrow-left-icon"
import ArrowUpIcon from "../../../components/fundamentals/icons/arrow-up-icon"
import ArrowDownIcon from "../../../components/fundamentals/icons/arrow-down-icon"
import ShiftIcon from "../../../components/fundamentals/icons/shift-icon"
import ListArrowIcon from "../../../components/fundamentals/icons/list-arrow"
import IconTooltip from "../../../components/molecules/icon-tooltip"
import HorizontalScrollFade from "../../../components/atoms/horizontal-scroll"

/**
 * Number of products that are shown on a single bulk table page.
 */
const BULK_TABLE_PRODUCT_LIMIT = 5

/**
 * Struct for holding multiedit state.
 */
type CellPointers = {
  anchorV: number
  anchorR: number
  // row/col min-max
  minV: number
  maxV: number
  minR: number
  maxR: number
  // "coordinates" of the last clicked cell
  lastV: number
  lastR: number
}

/**
 * Generate unique ID for a cell in the bulk table.
 */
const getPriceKey = (variantId: string, regionId: string) =>
  `${variantId}-${regionId}`

/**
 * Helper for generating table field filter options.
 */
function generateField(region: Region) {
  return {
    id: region.id,
    short: `Price: ${region.currency_code.toUpperCase()} (${region.name}) `,
    label: ({ isSelected }) => (
      <span className="text-small text-grey-50 truncate">
        <span className={clsx("text-grey-90", { "font-semibold": isSelected })}>
          {region.currency_code.toUpperCase()}:{" "}
        </span>
        ({region.name})
      </span>
    ),
  }
}

type TileProps = {
  active?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * Bulk editor cell tile component.
 */
function Tile(props: TileProps) {
  return (
    <div
      className={clsx(
        `
        h-[40px]
        min-w-[314px]
        rounded-lg
        text-gray-90
        text-small
        flex items-center
        pl-3
        `,
        props.className,
        {
          "border border-solid border-grey-20 bg-grey-5": props.active,
          "bg-grey-10": !props.active,
        }
      )}
    >
      {props.children}
    </div>
  )
}

type PriceListBulkEditorHeaderProps = {
  setRegions: (a: string[]) => void
  currentPriceListId: string
  onPriceListSelect: (priceListId: string) => void
}

/**
 * Header component for the bulk editor.
 */
function PriceListBulkEditorHeader(props: PriceListBulkEditorHeaderProps) {
  const { currentPriceListId, onPriceListSelect, setRegions } = props

  const { regions } = useAdminRegions()
  const { price_lists } = useAdminPriceLists()

  const fields = (regions || [])
    .sort((a, b) => a.currency_code.localeCompare(b.currency_code))
    .map((r) => generateField(r))

  return (
    <div className="flex justify-center my-[30px]">
      <div className="medium:w-8/12 w-full px-8 flex justify-between">
        <div className="flex items-start">
          <div className="flex shrink-0 items-center mt-1">
            <span className="text-small font-semibold text-grey-50">
              Price list:
            </span>

            <NativeSelect
              value={currentPriceListId}
              onValueChange={onPriceListSelect}
            >
              {price_lists?.map((pl) => (
                <NativeSelect.Item value={pl.id}>{pl.name}</NativeSelect.Item>
              ))}
            </NativeSelect>
          </div>

          <div className="ml-8">
            <TableFieldsFilters fields={fields} onChange={setRegions} />
          </div>
        </div>
      </div>
    </div>
  )
}

type ProductSectionHeaderProps = {
  product: Product
  isFirst: boolean
  activeRegions: Region[]
  onHeaderClick: (regionId: string, productId: string) => void
}

/**
 * Header for the product section of the bulk editor table.
 */
function ProductSectionHeader(props: ProductSectionHeaderProps) {
  const { activeRegions, product, isFirst, onHeaderClick } = props

  return (
    <>
      {isFirst && (
        <div className="flex mb-2 gap-2">
          <div className="min-w-[314px]">
            <span className="text-small font-semibold text-grey-50">
              Product title (SKU):
            </span>
          </div>

          {activeRegions.map((r) => (
            <div className="min-w-[314px]">
              <span className="text-small font-semibold text-grey-50">
                {r.currency_code.toUpperCase()} ({r.name})
              </span>
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
        {activeRegions.map((r) => (
          <div
            onClick={(e) => onHeaderClick(r.id, product.id, e.shiftKey)}
            className="min-w-[314px] cursor-pointer"
          >
            <span className="text-small font-semibold text-grey-50">
              <Tile className="flex justify-end px-2">
                <ListArrowIcon size={16} />
              </Tile>
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

type PriceListBulkEditorFooterProps = {
  count?: number
  page: number
  setPage: (offset: number) => void
}

/**
 * Footer component for the bulk editor.
 */
function PriceListBulkEditorFooter(props: PriceListBulkEditorFooterProps) {
  const { page, count, setPage } = props

  const upperProductNumberLimit = (page + 1) * BULK_TABLE_PRODUCT_LIMIT

  const pageStart = page * BULK_TABLE_PRODUCT_LIMIT + 1
  const pageEnd = Math.min(upperProductNumberLimit, count)

  const pageInfo = `${pageStart} - ${pageEnd} of ${count}`

  const canPrev = page > 0
  const canNext = upperProductNumberLimit < count

  const onPrev = () => {
    if (canPrev) setPage(page - 1)
  }

  const onNext = () => {
    if (canNext) {
      setPage(page + 1)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center p-5">
      <div className="medium:w-8/12 w-full flex justify-between text-small text-gray-400">
        <div>{pageInfo}</div>

        <div className="flex flex-row gap-2 items-center">
          <div className="rounded-base bg-grey-10 p-1">
            <ShiftIcon size={14} />
          </div>
          <span> + </span>
          <div className="rounded-base bg-grey-10 p-1">
            <ArrowLeftIcon size={14} />
          </div>
          <div className="rounded-base bg-grey-10 p-1">
            <ArrowUpIcon size={14} />
          </div>
          <div className="rounded-base bg-grey-10 p-1">
            <ArrowRightIcon size={14} />
          </div>
          <div className="rounded-base bg-grey-10 p-1">
            <ArrowDownIcon size={14} />
          </div>
          <span>to select multiple rows/columns.</span>
          <span>Hold</span>
          <div className="rounded-base bg-grey-10 p-1">
            <ShiftIcon size={14} />
          </div>
          <span>to select multiple cells.</span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span>
            {page + 1} of {Math.ceil(count / BULK_TABLE_PRODUCT_LIMIT)}
          </span>
          <a
            className={clsx({
              "cursor-pointer": canPrev,
              "text-grey-30": !canPrev,
            })}
            onClick={onPrev}
          >
            <ArrowLeftIcon />
          </a>
          <a
            className={clsx({
              "cursor-pointer": canNext,
              "text-grey-30": !canNext,
            })}
            onClick={onNext}
          >
            <ArrowRightIcon />
          </a>
        </div>
      </div>
    </div>
  )
}

type ProductSectionProps = {
  product: Product
  isFirst: boolean
  activeRegions: Region[]

  onHeaderClick: (regionId: string, productId: string) => void

  isVariantInPriceList: (variantId: string) => boolean

  isActive: (variantId: string, regionId: string) => boolean
  getPriceChange: (variantId: string, regionId: string) => string

  currentEditAmount?: string
  onAmountChange: (variantId: string, regionId: string, amount: string) => void
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    variantId: string,
    regionId: string
  ) => void
  onPriceInputClick: (
    e: React.MouseEvent<HTMLInputElement>,
    variantId: string,
    regionId: string
  ) => void
}

/**
 * Product section container, renders product variant rows.
 */
function ProductSection(props: ProductSectionProps) {
  const {
    activeRegions,
    product,
    isFirst,
    isVariantInPriceList,
    ...rest
  } = props

  return (
    <div className="px-8 mb-4">
      <ProductSectionHeader
        isFirst={isFirst}
        product={product}
        activeRegions={activeRegions}
        onHeaderClick={rest.onHeaderClick}
      />
      {product.variants.map((v) => (
        <ProductVariantRow
          key={v.id}
          variant={v}
          activeRegions={activeRegions}
          isActive={rest.isActive}
          getPriceChange={rest.getPriceChange}
          onKeyDown={rest.onKeyDown}
          currentEditAmount={rest.currentEditAmount}
          disabled={!isVariantInPriceList(v.id)}
          // HANDLERS
          onAmountChange={rest.onAmountChange}
          onPriceInputClick={rest.onPriceInputClick}
        />
      ))}
    </div>
  )
}

type ProductVariantRowProps = {
  disabled: boolean
  variant: ProductVariant
  activeRegions: Region[]

  isActive: (variantId: string, regionId: string) => boolean
  getPriceChange: (variantId: string, regionId: string) => string | undefined

  currentEditAmount?: string
  onAmountChange: (variantId: string, regionId: string, amount: string) => void
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    variantId: string,
    regionId: string
  ) => void
  onPriceInputClick: (
    e: React.MouseEvent<HTMLInputElement>,
    variantId: string,
    regionId: string
  ) => void
}

/**
 * Component renders a bulk editor row.
 */
function ProductVariantRow(props: ProductVariantRowProps) {
  const {
    currentEditAmount,
    activeRegions,
    variant,
    disabled,
    onKeyDown,
    onPriceInputClick,
    onAmountChange,
    getPriceChange,
    isActive,
  } = props

  return (
    <div className="flex gap-2 mb-2">
      <Tile
        active={!disabled}
        className="pl-[42px] pr-2 text-grey-90 flex justify-between items-center"
      >
        {variant.title} {variant.sku && `(${variant.sku})`}
        {disabled && (
          <IconTooltip content="Variant not part of price list. Edit the price field to add it." />
        )}
      </Tile>

      {activeRegions.map((region) => {
        const current = variant.prices.find(
          (p) =>
            p.region_id === region.id &&
            p.min_quantity === null &&
            p.max_quantity === null
        )

        const baseAmount = current?.amount
          ? current?.amount /
            10 **
              currencies[current?.currency_code.toUpperCase()]?.decimal_digits
          : undefined

        let editedPrice = getPriceChange(variant.id, region.id)
        if (editedPrice === null) {
          editedPrice = undefined
        } else {
          editedPrice = editedPrice || baseAmount
        }

        const amount = isActive(variant.id, region.id)
          ? currentEditAmount
          : editedPrice

        return (
          <div key={region.id} className="min-w-[314px]">
            <PriceInput
              amount={amount}
              disabled={disabled}
              currency={currencies[region.currency_code.toUpperCase()]}
              hasVirtualFocus={isActive(variant.id, region.id)}
              onMouseDown={(e) => onPriceInputClick(e, variant.id, region.id)}
              onAmountChange={(a) => onAmountChange(variant.id, region.id, a)}
              onKeyDown={(e) => onKeyDown(e, variant.id, region.id)}
              /* prevent `onAmountChange` call from the library */
              onBlur={(e) => e.preventDefault()}
              data-id={getPriceKey(variant.id, region.id)}
              className="js-bt-input"
            />
          </div>
        )
      })}
    </div>
  )
}

type PriceListBulkEditorProps = {
  products: Product[]
  activeRegions: Region[]
  priceChanges: Record<string, string>
  isVariantInPriceList: (variantId: string) => boolean
  setPriceChanges: (a: Record<string, string>) => void
}

/**
 * Root component for the bulk editor.
 * Implements table rendering and all multiedit/multiselect behaviour.
 */
function PriceListBulkEditor(props: PriceListBulkEditorProps) {
  const {
    activeRegions,
    products,
    priceChanges,
    setPriceChanges,
    isVariantInPriceList,
  } = props

  const [activeFields, setActiveFields] = useState({})
  const [currentEditAmount, setCurrentEditAmount] = useState<
    string | undefined
  >()

  const { current: pointers } = useRef<CellPointers>({} as CellPointers)

  /**
   * A struct for mapping between table cell indexes and variant/regions ids.
   */
  const matrix: [string[], string[]] = useMemo(() => {
    const variants = products.reduce(
      (acc: string[], p: Product) => [...acc, ...p.variants.map((v) => v.id)],
      []
    )

    return [variants, activeRegions.map((r) => r.id)]
  }, [activeRegions, products])

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const isPriceInputClicked = (e.target as Element).classList.contains(
        "js-bt-input"
      )

      // artificial blur event
      if (!isPriceInputClicked) {
        setCurrentEditAmount(undefined)
        setActiveFields({})
      }
    }

    document.addEventListener("mousedown", onMouseDown)
    return () => document.removeEventListener("mousedown", onMouseDown)
  }, [])

  /* ********** HELPERS ********** */

  const activateField = (cellKey: string) => {
    setActiveFields({ ...activeFields, [cellKey]: true })
  }

  const deactivateField = (cellKey: string) => {
    const tmp = { ...activeFields }
    delete tmp[cellKey]

    setActiveFields(tmp)
  }

  const toggleActive = (cellKey: string) => {
    if (activeFields[cellKey]) {
      deactivateField(cellKey)
    } else {
      activateField(cellKey)
    }
  }

  const setActiveCellsFromPointers = () => {
    const next = {}
    const [variants, regions] = matrix

    for (let i = pointers.minV; i <= pointers.maxV; i++) {
      const v = variants[i]
      for (let j = pointers.minR; j <= pointers.maxR; j++) {
        const r = regions[j]
        next[getPriceKey(v, r)] = true
      }
    }

    setActiveFields(next)
  }

  /* ********** SELECTORS ********** */

  const isActive = (variantId: string, regionId: string) =>
    activeFields[getPriceKey(variantId, regionId)]

  const getPriceChange = (variantId: string, regionId: string) => {
    const key = getPriceKey(variantId, regionId)

    if (key in priceChanges && !priceChanges[key]) {
      return null
    }
    return priceChanges[key]
  }

  /* ********** HANDLERS ********** */

  /*
   * A handler that implement logic for mouse click multi select.
   * Responsible for triggering focus/blur events on an input filed.
   */
  const onPriceInputClick = (
    event: React.MouseEvent<HTMLInputElement>,
    variantId: string,
    regionId: string
  ) => {
    const cellKey = getPriceKey(variantId, regionId)

    if (event.shiftKey) {
      event.preventDefault() // do not focus

      const active = isActive(variantId, regionId)
      toggleActive(cellKey)

      if (active) {
        const wasFocused = event.target === document.activeElement
        event.target.blur()

        if (wasFocused) {
          // find another active cell to focus
          const id = Object.keys(activeFields).find((k) => k !== cellKey)
          document.querySelector(`[data-id="${id}"]`)?.focus()
        }
      } else {
        event.target.focus()
      }
    } else {
      // TODO: the issue here is that `onAmount` is called by the underlying library on blur (which is triggered after this on click handler)
      // SCENARIO: one cell is focused and the user clicks on an other cell (without shift)
      // the `onClick` handler of the second cell is called first which executes the following 2 lines and resets the state
      // after that, onBlur of the first cell, the underlying library calls `onAmount` change which sets last edit value in the state again.

      setCurrentEditAmount(undefined)
      setActiveFields({ [cellKey]: true })
    }
  }

  /*
   * A handler that implement logic for arrow keys multi select.
   */
  const onKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    variantId: string,
    regionId: string
  ) => {
    if (event.key === "Tab") {
      event.preventDefault()
    }

    if (event.key === "Enter") {
      event.target?.blur()
      setCurrentEditAmount(undefined)
      setActiveFields({})
      return
    }

    if (!event.shiftKey) {
      return
    }

    const isArrowUp = event.key === "ArrowUp"
    const isArrowDown = event.key === "ArrowDown"
    const isArrowRight = event.key === "ArrowRight"
    const isArrowLeft = event.key === "ArrowLeft"

    const [variants, regions] = matrix

    // only shift is pressed without any arrow keys (set the current PriceInput cell as the anchor)
    if (!isArrowUp && !isArrowDown && !isArrowRight && !isArrowLeft) {
      const currentV = variants.indexOf(variantId)
      const currentR = regions.indexOf(regionId)

      // if only "Shift" is pressed set this as the current anchor
      pointers.anchorV = currentV
      pointers.anchorR = currentR

      pointers.lastR = currentR
      pointers.lastV = currentV

      pointers.minV = currentV
      pointers.maxV = currentV

      pointers.minR = currentR
      pointers.maxR = currentR

      return
    }

    event.preventDefault()

    if (isArrowUp) {
      pointers.lastV = Math.max(pointers.lastV - 1, 0)

      if (pointers.anchorV > pointers.lastV) {
        pointers.minV = Math.min(pointers.minV, pointers.lastV)
      } else {
        pointers.maxV = pointers.lastV
      }
    }

    if (isArrowDown) {
      pointers.lastV = Math.min(pointers.lastV + 1, variants.length - 1)

      if (pointers.anchorV < pointers.lastV) {
        pointers.maxV = Math.max(pointers.maxV, pointers.lastV)
      } else {
        pointers.minV = pointers.lastV
      }
    }

    if (isArrowLeft) {
      pointers.lastR = Math.max(pointers.lastR - 1, 0)

      if (pointers.anchorR > pointers.lastR) {
        pointers.minR = Math.min(pointers.minR, pointers.lastR)
      } else {
        pointers.maxR = pointers.lastR
      }
    }

    if (isArrowRight) {
      pointers.lastR = Math.min(pointers.lastR + 1, regions.length - 1)

      if (pointers.anchorR < pointers.lastR) {
        pointers.maxR = Math.max(pointers.maxR, pointers.lastR)
      } else {
        pointers.minR = pointers.lastR
      }
    }

    setActiveCellsFromPointers()
  }

  const onAmountChange = (
    variantId: string,
    regionId: string,
    amount: string
  ) => {
    // TODO: format all price inputs on change here

    const tmp = { ...priceChanges }

    // for each input that is currently edited set the amount
    Object.keys(activeFields).forEach((k) => (tmp[k] = amount))

    setPriceChanges(tmp)
    setCurrentEditAmount(amount)
  }

  const onHeaderClick = (
    regionId: string,
    productId: string,
    isShiftDown = false
  ) => {
    const product = products.find((p) => p.id === productId)!

    document
      .querySelector(
        `[data-id="${getPriceKey(product.variants[0].id, regionId)}"]`
      )
      ?.focus()

    const tmp = isShiftDown ? { ...activeFields } : {}

    setCurrentEditAmount(undefined)

    product.variants.forEach((v) => (tmp[getPriceKey(v.id, regionId)] = true))
    setActiveFields(tmp)
  }

  return (
    <HorizontalScrollFade>
      <div style={{ marginBottom: -16, marginTop: -4 }}>
        {products.map((p, ind) => (
          <ProductSection
            key={p.id}
            product={p}
            isFirst={!ind}
            priceChanges={priceChanges}
            setPriceChanges={setPriceChanges}
            activeRegions={activeRegions}
            isVariantInPriceList={isVariantInPriceList}
            // Edit controls
            currentEditAmount={currentEditAmount}
            onKeyDown={onKeyDown}
            onHeaderClick={onHeaderClick}
            onPriceInputClick={onPriceInputClick}
            onAmountChange={onAmountChange}
            getPriceChange={getPriceChange}
            isActive={isActive}
          />
        ))}
      </div>
    </HorizontalScrollFade>
  )
}

type PriceListBulkEditorContainerProps = {
  priceList: PriceList
  closeEditor: () => void
}

/**
 * Root container for the bulk editor.
 */
function PriceListBulkEditorContainer(
  props: PriceListBulkEditorContainerProps
) {
  const { priceList, closeEditor } = props
  const [page, setPage] = useState(0)

  const [currentPriceListId, setCurrentPriceListId] = useState(priceList.id)
  const [priceChanges, setPriceChanges] = useState<Record<string, string>>({})

  const { regions } = useAdminRegions()
  const [activeRegions, setActiveRegions] = useState<string[]>([])

  const updatePriceList = useAdminCreatePriceListPrices(currentPriceListId)
  const { products, count } = useAdminPriceListProducts(
    currentPriceListId,
    {
      limit: BULK_TABLE_PRODUCT_LIMIT,
      offset: page * BULK_TABLE_PRODUCT_LIMIT,
    },
    {
      keepPreviousData: true,
    }
  )

  const variantsOfList = useMemo(
    () =>
      priceList.prices.reduce((ret, p) => {
        ret[p.variant_id] = true
        return ret
      }, {}),
    [priceList]
  )

  /**
   * When a region is removed unset `priceChanges` related to that region
   */
  useEffect(() => {
    const regions = activeRegions.reduce((acc, r) => {
      acc[r] = true
      return acc
    }, {})

    const tmp = { ...priceChanges }
    for (const id in tmp) {
      const [_, regionId] = tmp[id].split("-")
      if (!(regionId in regions)) {
        delete tmp[id]
      }
    }

    setPriceChanges(tmp)
  }, [activeRegions])

  useEffect(() => {
    setPage(0)
  }, [currentPriceListId])

  const isVariantInPriceList = (variantId: string) =>
    !!variantsOfList[variantId]

  const checkForChanges = () => {
    const hasChanges = !!Object.keys(priceChanges).length

    if (hasChanges) {
      const isConfirmed = confirm(
        "There are unsaved changes. Do you want to discard and continue?"
      )

      if (isConfirmed) {
        setPriceChanges({})
        return true
      } else {
        return false
      }
    }

    return true
  }

  const onPriceListSelect = (priceListId: string) => {
    if (checkForChanges()) {
      setCurrentPriceListId(priceListId)
    }
  }

  const onClose = () => {
    if (checkForChanges()) {
      closeEditor()
    }
  }

  /**
   * Save changes callback.
   * Iterate over a price changes object and prepare MA prices for bulk update.
   */
  const onSave = () => {
    const prices: Partial<MoneyAmount>[] = []

    const _priceChanges = { ...priceChanges }

    priceList.prices
      .map((p) =>
        pick(p, [
          "amount",
          "variant_id",
          "region_id",
          "min_quantity",
          "max_quantity",
          "currency_code",
        ])
      )
      .map((plPrice) => {
        if (
          plPrice.region_id &&
          plPrice.min_quantity === null &&
          plPrice.max_quantity === null
        ) {
          const priceKey = getPriceKey(plPrice.variant_id, plPrice.region_id)
          if (priceKey in _priceChanges) {
            // MA is deleted
            if (_priceChanges[priceKey] === undefined) {
              return
            }

            // MA is updated

            const preparedAmount = Math.round(
              parseFloat(_priceChanges[priceKey]) *
                10 **
                  currencies[plPrice.currency_code.toUpperCase()].decimal_digits
            )

            if (isNaN(preparedAmount)) {
              return
            }

            prices.push({
              variant_id: plPrice.variant_id,
              region_id: plPrice.region_id,
              amount: preparedAmount,
            })

            delete _priceChanges[priceKey]
          } else {
            prices.push(plPrice)
          }
        } else {
          prices.push(plPrice)
        }
      })

    // entries that are left --> MAs to be created
    Object.entries(_priceChanges).map(([k, amount]) => {
      const [variantId, regionId] = k.split("-")

      const reg = regions?.find((r) => r.id === regionId)!
      const curr = currencies[reg.currency_code.toUpperCase()]

      const preparedAmount = Math.round(
        parseFloat(amount) *
          10 ** currencies[curr.code.toUpperCase()].decimal_digits
      )

      if (isNaN(preparedAmount)) {
        return
      }

      prices.push({
        variant_id: variantId,
        region_id: regionId,
        amount: preparedAmount,
      })
    })

    prices.forEach((p) => {
      delete p.id
      if (p.region_id) {
        delete p.currency_code
      }
    }) // new records will be created

    updatePriceList.mutate(
      { prices, override: true },
      { onSuccess: () => closeEditor() }
    )
  }

  const displayRegions = activeRegions
    .map((activeRegionId) =>
      regions?.find((region) => region.id === activeRegionId)
    )
    .filter((i) => !!i)
    .sort((a, b) => a.currency_code.localeCompare(b.currency_code)) as Region[]

  if (!regions || !products) {
    return null
  }

  return (
    <Fade isVisible isFullScreen>
      <FocusModal>
        <FocusModal.Header>
          <div className="medium:w-8/12 w-full px-8 flex justify-between">
            <div className="flex items-center gap-4">
              <Button
                size="small"
                variant="ghost"
                onClick={onClose}
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
                size="small"
                variant="ghost"
                className="border rounded-rounded"
                onClick={closeEditor}
              >
                Discard
              </Button>

              <Button size="small" onClick={onSave} className="rounded-rounded">
                Save
              </Button>
            </div>
          </div>
        </FocusModal.Header>

        <FocusModal.Main>
          <PriceListBulkEditorHeader
            setRegions={setActiveRegions}
            onPriceListSelect={onPriceListSelect}
            currentPriceListId={currentPriceListId}
          />

          <div className="medium:w-8/12 w-full flex flex-col justify-start mx-auto mb-7 pt-2">
            <PriceListBulkEditor
              products={products!}
              activeRegions={displayRegions}
              priceChanges={priceChanges}
              setPriceChanges={setPriceChanges}
              isVariantInPriceList={isVariantInPriceList}
            />
          </div>

          <PriceListBulkEditorFooter
            page={page}
            count={count}
            setPage={setPage}
          />
        </FocusModal.Main>
      </FocusModal>
    </Fade>
  )
}

export default PriceListBulkEditorContainer
