import React, { useEffect, useMemo, useRef, useState } from "react"
import { useObserveWidth } from "../../../hooks/use-observe-width"
import DenominationBadge from "../../atoms/denomination-badge"

export type GiftCardVariant = {
  prices: {
    currency_code: string
    amount: number
  }[]
}

type DenominationGridProps = {
  variants: GiftCardVariant[]
  defaultCurrency: string
}

const DenominationGrid: React.FC<DenominationGridProps> = ({
  variants,
  defaultCurrency,
}) => {
  const containerRef = useRef(null)

  const width = useObserveWidth(containerRef)

  const [columns, setColumns] = useState(7)

  // We estimate that a Badge is rouglhy 70px and use this to calulate how many we can fit in a row
  // It is a bit of a "magic" number, but it works for now.
  useEffect(() => {
    if (width) {
      setColumns(Math.floor(width / 70) - 1)
    }
  }, [width])

  const defaultDenominations = useMemo(() => {
    return (
      variants.map(variant => {
        const price = variant.prices.find(
          price => price.currency_code === defaultCurrency
        )
        return { amount: price?.amount, currencyCode: defaultCurrency }
      }) ?? []
    )
  }, [variants, defaultCurrency])

  const [denominations, setDenominations] = useState<
    { amount: number; currencyCode: string }[] | null
  >([])
  const [remainder, setRemainder] = useState(0)

  useEffect(() => {
    if (defaultDenominations.length) {
      setDenominations(defaultDenominations.slice(0, columns))
      setRemainder(defaultDenominations.length - columns)
    }

    return
  }, [defaultDenominations, columns])

  return (
    <div className="flex items-center gap-x-2xsmall w-1/2" ref={containerRef}>
      {denominations.map((denomination, index) => {
        return (
          <DenominationBadge
            className="mr-2xsmall"
            key={index}
            amount={denomination.amount}
            currencyCode={denomination.currencyCode}
          />
        )
      })}
      {remainder > 0 && (
        <div className="inline-block">
          <div className="py-[2px] px-xsmall bg-grey-10 rounded-rounded flex items-center justify-center">
            <span className="inter-small-regular">+{remainder}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default DenominationGrid
