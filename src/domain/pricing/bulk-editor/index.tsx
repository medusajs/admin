import React, { useEffect, useMemo, useRef, useState } from "react"
import clsx from "clsx"

import {
  useAdminPriceListProducts,
  useAdminPriceLists,
  useAdminRegions,
} from "medusa-react"
import { PriceList, Product, ProductVariant, Region } from "@medusajs/medusa"

import Fade from "../../../components/atoms/fade-wrapper"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import NativeSelect from "../../../components/molecules/native-select"
import TableFieldsFilters from "../../../components/molecules/table-fileds-filter"
import TableSearch from "../../../components/molecules/table/table-search"
import { currencies } from "../../../utils/currencies"
import PriceInput from "../../../components/organisms/price-input"
import ImagePlaceholder from "../../../components/fundamentals/image-placeholder"
import PointerIcon from "../../../components/fundamentals/icons/pointer-icon"
import ArrowRightIcon from "../../../components/fundamentals/icons/arrow-right-icon"
import ArrowLeftIcon from "../../../components/fundamentals/icons/arrow-left-icon"
import ArrowUpIcon from "../../../components/fundamentals/icons/arrow-up-icon"
import ArrowDownIcon from "../../../components/fundamentals/icons/arrow-down-icon"
import ShiftIcon from "../../../components/fundamentals/icons/shift-icon"

const getPriceKey = (variantId: string, regionId: string) =>
  `${variantId}-${regionId}`

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

type PriceListBulkEditorHeaderProps = {
  setRegions: (a: string[]) => void
  currentPriceListId: string
  onPriceListSelect: (priceListId: string) => void
}

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
  activeRegions: Region[]
  onHeaderClick: (regionId: string) => void
}

function ProductSectionHeader(props: ProductSectionHeaderProps) {
  const { activeRegions, product, isFirst, onHeaderClick } = props

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
        <div className="min-w-[314px]">
          <span className="text-small font-semibold text-grey-50">
            <Tile>-</Tile>
          </span>
        </div>
        {activeRegions.map((r) => (
          <div
            onClick={() => onHeaderClick(r.id)}
            className="min-w-[314px] cursor-pointer"
          >
            <span className="text-small font-semibold text-grey-50">
              <Tile>-</Tile>
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

type CellPointers = {
  anchorV: number
  anchorR: number
  // row/col min-max
  minV: number
  maxV: number
  minR: number
  maxR: number
  // last
  lastV: number
  lastR: number
}

type ProductSectionProps = {
  product: Product
  isFirst: boolean
  activeRegions: Region[]
}

let skip = false

function ProductSection(props: ProductSectionProps) {
  const { activeRegions, product, isFirst } = props

  const [activeFields, setActiveFields] = useState({})
  const [priceChanges, setPriceChanges] = useState({})
  const [currentEditAmount, setCurrentEditAmount] = useState<string>()

  const { current: pointers } = useRef<CellPointers>({} as CellPointers)

  /**
   * A struct for mapping between table cell indexes and variant/regions ids.
   */
  const matrix = useMemo(() => {
    return [product.variants.map((v) => v.id), activeRegions.map((r) => r.id)]
  }, [activeRegions, product.variants])

  useEffect(() => {
    const handler = (e) => {
      const isPriceInputClicked = e.target.classList.contains("js-bt-input")
      // TODO: check whether the input is from the same product section or from another

      // artificial blur event
      if (!isPriceInputClicked) {
        setCurrentEditAmount(undefined)
        setActiveFields({})
      }
    }

    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
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

  const getPriceChange = (variantId: string, regionId: string) =>
    priceChanges[getPriceKey(variantId, regionId)]

  /* ********** HANDLERS ********** */

  /*
   * A handler that implement logic for mouse click multi select.
   * Responsible for triggering focus/blur events on an input filed.
   */
  const onPriceInputClick = (
    e: React.MouseEvent<HTMLInputElement>,
    variantId: string,
    regionId: string
  ) => {
    const cellKey = getPriceKey(variantId, regionId)

    // TODO: force formatting on cell blur

    // const tmp = { ...priceChanges }
    // const c =
    //   currencies[
    //     props.activeRegions
    //       .find((r) => r.id === regionId)
    //       .currency_code.toUpperCase()
    //   ]
    //
    // const formatted = (
    //   Math.round(parseFloat(currentEditAmount) * 10 ** c.decimal_digits) /
    //   10 ** c.decimal_digits
    // ).toFixed(c.decimal_digits)
    //
    // Object.keys(activeFields).forEach((k) => (tmp[k] = formatted))

    if (e.shiftKey) {
      e.preventDefault() // do not focus

      const active = isActive(variantId, regionId)
      toggleActive(cellKey)

      if (active) {
        const wasFocused = e.target === document.activeElement
        e.target.blur()

        if (wasFocused) {
          // find another active cell to focus
          const id = Object.keys(activeFields).filter((k) => k !== cellKey)[0]
          document.getElementById(id)?.focus()
        }
      } else {
        e.target.focus()
      }
    } else {
      skip = true
      setCurrentEditAmount(undefined)
      setActiveFields({ [cellKey]: true })
    }
  }

  /*
   * A handler that implement logic for arrow keys multi select.
   */
  const onKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    variantId: string,
    regionId: string
  ) => {
    if (e.key === "Tab") {
      e.preventDefault()
    }

    if (e.key === "Enter") {
      skip = true
      e.target?.blur()
      setCurrentEditAmount(undefined)
      setActiveFields({})
      return
    }

    if (!e.shiftKey) {
      return
    }

    const isArrowUp = e.key === "ArrowUp"
    const isArrowDown = e.key === "ArrowDown"
    const isArrowRight = e.key === "ArrowRight"
    const isArrowLeft = e.key === "ArrowLeft"

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

      // TODO: if "Shift" key is not pressed implement cell navigation

      return
    }

    e.preventDefault()

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
    // skip this callback in case `onAmount` is called on price input blur
    if (skip) {
      skip = false

      return
    }

    const tmp = { ...priceChanges }

    // for each input that is currently edited set the amount
    Object.keys(activeFields).forEach((k) => (tmp[k] = amount))

    setPriceChanges(tmp)
    setCurrentEditAmount(amount)
  }

  const onHeaderClick = (regionId: string) => {
    document
      .getElementById(getPriceKey(product.variants[0].id, regionId))
      ?.focus()

    setCurrentEditAmount(undefined)

    const tmp = {}
    product.variants.forEach((v) => (tmp[getPriceKey(v.id, regionId)] = true))
    setActiveFields(tmp)
  }

  return (
    <div className="px-8 mb-4">
      <ProductSectionHeader
        isFirst={isFirst}
        product={product}
        activeRegions={activeRegions}
        onHeaderClick={onHeaderClick}
      />
      {product.variants.map((v) => (
        <ProductVariantRow
          key={v.id}
          variant={v}
          isActive={isActive}
          getPriceChange={getPriceChange}
          onKeyDown={onKeyDown}
          activeRegions={activeRegions}
          currentEditAmount={currentEditAmount}
          // HANDLERS
          onAmountChange={onAmountChange}
          onPriceInputClick={onPriceInputClick}
        />
      ))}
    </div>
  )
}

type ProductVariantRowProps = {
  variant: ProductVariant
  activeRegions: Region[]

  isActive: (variantId: string, regionId: string) => boolean
  getPriceChange: (variantId: string, regionId: string) => string

  currentEditAmount?: string
  onAmountChange: (variantId: string, regionId: string, amount: string) => void
  onKeyDown: (
    e: React.MouseEvent<HTMLInputElement>,
    variantId: string,
    regionId: string
  ) => void
  onPriceInputClick: (
    e: React.MouseEvent<HTMLInputElement>,
    variantId: string,
    regionId: string
  ) => void
}

function ProductVariantRow(props: ProductVariantRowProps) {
  const {
    currentEditAmount,
    activeRegions,
    variant,
    onKeyDown,
    onPriceInputClick,
    onAmountChange,
    getPriceChange,
    isActive,
  } = props

  return (
    <div className="flex gap-2 mb-2">
      <Tile className="pl-[42px]">{variant.title}</Tile>
      <Tile>{variant.sku}</Tile>

      {activeRegions.map((r) => {
        // TODO: filter prices by the current price list id
        // const current = variant.prices.find((p) => p.region_id === r.id)
        const current = variant.prices.find(
          (p) => p.currency_code === r.currency_code
        )

        const amount = isActive(variant.id, r.id)
          ? currentEditAmount
          : getPriceChange(variant.id, r.id) || current?.amount // saved as a string

        return (
          <div key={r.id} className="min-w-[314px]">
            <PriceInput
              amount={amount}
              currency={currencies[r.currency_code.toUpperCase()]}
              hasVirtualFocus={isActive(variant.id, r.id)}
              onMouseDown={(e) => onPriceInputClick(e, variant.id, r.id)}
              onAmountChange={(a) => onAmountChange(variant.id, r.id, a)}
              onKeyDown={(e) => onKeyDown(e, variant.id, r.id)}
              onBlur={
                /* prevent `onAmountChange` call from the library */
                (e) => e.preventDefault()
              }
              id={getPriceKey(variant.id, r.id)}
              className="js-bt-input"
            />
          </div>
        )
      })}
    </div>
  )
}

function Footer() {
  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center p-5">
      <div className="flex flex-row gap-2 items-center text-small text-gray-400">
        <div className="rounded-base bg-grey-10 p-1">
          <PointerIcon />
        </div>
        <span>or</span>
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
        <span>to switch between cells.</span>
        <span>Hold</span>
        <div className="rounded-base bg-grey-10 p-1">
          <ShiftIcon size={14} />
        </div>
        <span>to select multiple cells.</span>
      </div>
    </div>
  )
}

type PriceListBulkEditorProps = {
  priceList: PriceList
  closeForm: () => void
}

function PriceListBulkEditor(props: PriceListBulkEditorProps) {
  const { priceList, closeForm } = props

  const [currentPriceListId, setCurrentPriceListId] = useState(priceList.id)

  const [activeRegions, setActiveRegions] = useState<string[]>([])

  console.log(priceList)

  // TODO: should filter variants from products that are related to the price list
  const { products } = useAdminPriceListProducts(currentPriceListId)
  const { regions } = useAdminRegions()

  const onPriceListSelect = (priceListId: string) => {
    // TODO: check for changes
    setCurrentPriceListId(priceListId)
  }

  const onClose = () => {
    // TODO: check for changes
    closeForm()
  }

  console.log(products)

  if (!products) return null

  return (
    <Fade isVisible isFullScreen={true}>
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
                onClick={closeForm}
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
          <PriceListBulkEditorHeader
            setRegions={setActiveRegions}
            onPriceListSelect={onPriceListSelect}
            currentPriceListId={currentPriceListId}
          />

          <div className="medium:w-8/12 w-full flex flex-col justify-start mx-auto mb-7 overflow-x-auto-TODO">
            {regions &&
              products.map((p, ind) => (
                <ProductSection
                  key={p.id}
                  product={p}
                  isFirst={!ind}
                  activeRegions={
                    activeRegions
                      .map((r) => regions?.find((a) => a.id === r))
                      .filter((i) => !!i)
                      .sort((a, b) =>
                        a.currency_code.localeCompare(b.currency_code)
                      ) as Region[]
                  }
                />
              ))}
          </div>
          <Footer />
        </FocusModal.Main>
      </FocusModal>
    </Fade>
  )
}

export default PriceListBulkEditor
