import { Control, FieldPath, FieldValues, useWatch } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import MinusIcon from "../../../components/fundamentals/icons/minus-icon"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"

type TableQuantitySelectorProps<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  index: number
  isSelected?: boolean
  isSelectable?: boolean
  updateQuantity: (index: number, change: number) => void
  control: Control<TFieldValues>
  name: TFieldName
  maxQuantity?: number
}

const TableQuantitySelector = <
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  isSelected,
  isSelectable = false,
  updateQuantity,
  index,
  maxQuantity,
}: TableQuantitySelectorProps<TFieldValues, TFieldName>) => {
  const currentQuantity = useWatch({
    control,
    name: name,
  })

  const quantityFlag = isSelectable
    ? isSelectable && maxQuantity !== 1
    : maxQuantity !== 1

  return (
    <div className="flex items-center justify-end">
      {quantityFlag ? (
        <div className="inter-small-regular text-grey-50 grid grid-cols-3 gap-x-2xsmall">
          <Button
            variant="ghost"
            size="small"
            type="button"
            onClick={() => updateQuantity(index, -1)}
            disabled={currentQuantity === 1}
            className="disabled:text-grey-30 w-large h-large rounded-base"
          >
            <MinusIcon size={16} />
          </Button>
          <div className="flex items-center justify-center">
            <p>{currentQuantity}</p>
          </div>
          <Button
            variant="ghost"
            size="small"
            type="button"
            onClick={() => updateQuantity(index, 1)}
            disabled={maxQuantity ? currentQuantity === maxQuantity : undefined}
            className="disabled:text-grey-30 w-large h-large rounded-base"
          >
            <PlusIcon size={16} />
          </Button>
        </div>
      ) : (
        <p className="inter-small-regular text-grey-50">{currentQuantity}</p>
      )}
    </div>
  )
}

export default TableQuantitySelector
