import React, { useEffect, useMemo, useRef, useState } from "react"
import clsx from "clsx"

import { useAdminRegions } from "medusa-react"
import { Product, ProductVariant, Region } from "@medusajs/medusa"

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
}

function PriceListBulkEditorHeader(props: PriceListBulkEditorHeaderProps) {
  const { setRegions } = props

  const { regions } = useAdminRegions()

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

            <NativeSelect defaultValue="TODO 1">
              <NativeSelect.Item value="TODO 1">TODO 1</NativeSelect.Item>
              <NativeSelect.Item value="TODO 2">TODO 2</NativeSelect.Item>
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

const getPriceKey = (variantId: string, regionId: string) =>
  `${variantId}-${regionId}`

type ProductSectionProps = {
  product: Product
  isFirst: boolean
  activeRegions: Region[]
}

function ProductSection(props: ProductSectionProps) {
  const { activeRegions, product, isFirst } = props

  const [activeFields, setActiveFields] = useState({})
  const [priceChanges, setPriceChanges] = useState({})
  const [currentEditAmount, setCurrentEditAmount] = useState<string>()

  const { current } = useRef({
    anchorV: undefined,
    anchorR: undefined,
    // row/col min-max
    minV: undefined,
    maxV: undefined,
    minR: undefined,
    maxR: undefined,
    // last
    lastV: undefined,
    lastR: undefined,
  })

  // TODO: unset active on tab click

  const matrix = useMemo(() => {
    return [product.variants.map((v) => v.id), activeRegions.map((r) => r.id)]
  }, [activeRegions, product.variants])

  useEffect(() => {
    const handler = (e) => {
      // TODO: extract to a handler
      const isPriceInputClicked = e.target.classList.contains("js-bt-input")
      // TODO: check whether the input is from the same product section or from another

      if (!isPriceInputClicked) {
        // artificial blur event
        setCurrentEditAmount(undefined)
        setActiveFields({})
      }
    }

    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

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

  const isActive = (variantId: string, regionId: string) =>
    activeFields[getPriceKey(variantId, regionId)]

  const getPriceChange = (variantId: string, regionId: string) =>
    priceChanges[getPriceKey(variantId, regionId)]

  /* ********** HANDLERS ********** */

  const onPriceInputClick = (
    e: React.MouseEvent<HTMLInputElement>,
    variantId: string,
    regionId: string
  ) => {
    const cellKey = getPriceKey(variantId, regionId)

    if (e.shiftKey) {
      e.preventDefault() // do not focus

      const active = isActive(variantId, regionId)
      toggleActive(cellKey)

      if (active) {
        const wasFocused = e.target === document.activeElement
        e.target.blur()

        if (wasFocused) {
          const id = Object.keys(activeFields).filter((k) => k !== cellKey)[0]
          document.getElementById(id)?.focus()
        }
      } else e.target.focus()
    } else {
      setCurrentEditAmount(undefined)
      setActiveFields({ [cellKey]: true })
    }
  }

  const onKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    variantId: string,
    regionId: string
  ) => {
    if (e.key === "Tab") {
      e.preventDefault()
    }

    if (!e.shiftKey) {
      return
    }

    const isArrowUp = e.key === "ArrowUp"
    const isArrowDown = e.key === "ArrowDown"
    const isArrowRight = e.key === "ArrowRight"
    const isArrowLeft = e.key === "ArrowLeft"

    e.preventDefault()

    const [variants, regions] = matrix

    const currentV = variants.indexOf(variantId)
    const currentR = regions.indexOf(regionId)

    if (!isArrowUp && !isArrowDown && !isArrowRight && !isArrowLeft) {
      // if only "Shift" is pressed set this as the current anchor
      current.anchorV = currentV
      current.anchorR = currentR

      current.lastR = currentR
      current.lastV = currentV

      current.minV = currentV
      current.maxV = currentV

      current.minR = currentR
      current.maxR = currentR

      // TODO: if "Shift" key is not pressed implement cell navigation

      return
    }

    if (isArrowUp) {
      current.lastV = Math.max(current.lastV - 1, 0)

      if (current.anchorV > current.lastV) {
        current.minV = Math.min(current.minV, current.lastV)
      } else {
        current.maxV = current.lastV
      }
    }

    if (isArrowDown) {
      current.lastV = Math.min(current.lastV + 1, variants.length)

      if (current.anchorV < current.lastV) {
        current.maxV = Math.max(current.maxV, current.lastV)
      } else {
        current.minV = current.lastV
      }
    }

    if (isArrowLeft) {
      current.lastR = Math.max(current.lastR - 1, 0)

      if (current.anchorR > current.lastR) {
        current.minR = Math.min(current.minR, current.lastR)
      } else {
        current.maxR = current.lastR
      }
    }

    if (isArrowRight) {
      current.lastR = Math.min(current.lastR + 1, regions.length)

      if (current.anchorR < current.lastR) {
        current.maxR = Math.max(current.maxR, current.lastR)
      } else {
        current.minR = current.lastR
      }
    }

    const a = {}

    for (let i = current.minV; i <= current.maxV; i++) {
      const v = variants[i]
      for (let j = current.minR; j <= current.maxR; j++) {
        const r = regions[j]
        a[getPriceKey(v, r)] = true
      }
    }

    setActiveFields(a)
  }

  const onAmountChange = (
    variantId: string,
    regionId: string,
    amount: string
  ) => {
    const tmp = { ...priceChanges }

    // for each input that is currently edited set the amount
    Object.keys(activeFields).forEach((k) => (tmp[k] = amount))

    setPriceChanges(tmp)
    setCurrentEditAmount(amount) // TODO: this is set on blur
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

type PriceListBulkEditorProps = {
  products: Product[]
}

function PriceListBulkEditor(props: PriceListBulkEditorProps) {
  const { products } = props

  const [activeRegions, setActiveRegions] = useState<string[]>([])

  const { regions } = useAdminRegions()

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
          <PriceListBulkEditorHeader setRegions={setActiveRegions} />

          <div className="medium:w-8/12 w-full flex flex-col justify-start mx-auto overflow-x-auto-TODO">
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
        </FocusModal.Main>
      </FocusModal>
    </Fade>
  )
}

export default PriceListBulkEditor
