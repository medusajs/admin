import type { Identifier, XYCoord } from "dnd-core"
import React, { useEffect, useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { useForm } from "react-hook-form"
import Tooltip from "../../../../../components/atoms/tooltip"
import Button from "../../../../../components/fundamentals/button"
import CheckCircleFillIcon from "../../../../../components/fundamentals/icons/check-circle-fill-icon"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import GripIcon from "../../../../../components/fundamentals/icons/grip-icon"
import MoreHorizontalIcon from "../../../../../components/fundamentals/icons/more-horizontal-icon"
import Actionables from "../../../../../components/molecules/actionables"
import IconTooltip from "../../../../../components/molecules/icon-tooltip"
import Modal from "../../../../../components/molecules/modal"
import useToggleState from "../../../../../hooks/use-toggle-state"
import { DragItem } from "../../../../../types/shared"
import VariantForm, { VariantFormType } from "../../../components/variant-form"

const ItemTypes = {
  CARD: "card",
}

type Props = {
  id: string
  source: VariantFormType
  index: number
  save: (index: number, variant: VariantFormType) => void
  move: (dragIndex: number, hoverIndex: number) => void
}

const NewVariant = ({ id, source, index, save, move }: Props) => {
  const { state, toggle, close } = useToggleState()
  const localForm = useForm<VariantFormType>({
    defaultValues: source,
  })

  const { handleSubmit, reset } = localForm

  useEffect(() => {
    reset(source)
  }, [source])

  const onUpdate = handleSubmit((data) => {
    const payload = {
      ...data,
      title: data.title
        ? data.title
        : data.options.map((option) => option.value).join(" / "),
    }

    save(index, payload)
    close()
  })

  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      move(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <>
      <div
        ref={preview}
        data-handler-id={handlerId}
        className="grid grid-cols-[32px_1fr_90px_100px_48px] transition-all rounded-rounded hover:bg-grey-5 focus-within:bg-grey-5 h-16 py-xsmall pl-xsmall pr-base translate-y-0 translate-x-0"
      >
        <div
          ref={ref}
          className="text-grey-40 cursor-move flex items-center justify-center"
        >
          <GripIcon size={20} />
        </div>
        <div className="flex justify-center flex-col ml-base">
          <p className="inter-base-semibold">
            {source.title}
            {source.sku && (
              <span className="inter-base-regular text-grey-50 ml-2xsmall">
                ({source.sku})
              </span>
            )}
          </p>
          {source.ean && (
            <span className="inter-base-regular text-grey-50">
              {source.ean}
            </span>
          )}
        </div>
        <div className="flex items-center justify-end mr-xlarge">
          <p>{source.inventory_quantity || "-"}</p>
        </div>
        <div className="flex items-center justify-center">
          <VariantValidity source={source} />
        </div>
        <div className="ml-xlarge flex items-center justify-center pr-base">
          <Actionables
            forceDropdown
            actions={[
              {
                label: "Edit",
                icon: <EditIcon size={20} />,
                onClick: toggle,
              },
            ]}
            customTrigger={
              <Button
                variant="ghost"
                className="w-xlarge h-xlarge p-0 flex items-center justify-center text-grey-50"
              >
                <MoreHorizontalIcon size={20} />
              </Button>
            }
          />
        </div>
      </div>

      <Modal open={state} handleClose={close}>
        <Modal.Body>
          <Modal.Header handleClose={close}>
            <h1 className="inter-xlarge-semibold">
              Edit Variant
              {source.title && (
                <span className="ml-xsmall inter-xlarge-regular text-grey-50">
                  ({source.title})
                </span>
              )}
            </h1>
          </Modal.Header>
          <Modal.Content>
            <VariantForm form={localForm} />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center gap-x-xsmall justify-end w-full">
              <Button variant="secondary" size="small" type="button">
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                type="button"
                onClick={onUpdate}
              >
                Save and close
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
}

const VariantValidity = ({ source }: { source: VariantFormType }) => {
  const {
    inventory_quantity,
    prices,
    options,
    sku,
    customs,
    dimensions,
    barcode,
    upc,
    ean,
  } = source

  const invalidOptions = options.filter((opt) => !opt.value)

  if (invalidOptions?.length) {
    return (
      <IconTooltip
        type="error"
        content={
          <div className="text-rose-50 flex flex-col gap-y-2xsmall">
            <p>You are missing options values for the following options:</p>
            <ul className="list-disc list-inside">
              {invalidOptions.map((io, index) => {
                return <li key={index}>{io.title || `Option ${index + 1}`}</li>
              })}
            </ul>
          </div>
        }
      />
    )
  }

  const validPrices = prices?.prices.some((p) => p.amount !== null)
  const shippingValidity =
    Object.values(dimensions).every((value) => !!value) &&
    Object.values(customs).map((value) => !!value)
  const barcodeValidity = !!barcode || !!upc || !!ean

  if (!sku || !shippingValidity || !barcodeValidity || !validPrices) {
    return (
      <IconTooltip
        type="warning"
        side="right"
        content={
          <div className="text-orange-50 flex flex-col gap-y-2xsmall">
            <p>
              Your variant is createable, but it's missing some important
              fields:
            </p>
            <ul className="list-disc list-inside">
              {!validPrices && <li>Pricing</li>}
              {!shippingValidity && <li>Shipping</li>}
              {!inventory_quantity && <li>Inventory quantity</li>}
              {!sku && <li>SKU</li>}
              {!barcodeValidity && <li>Barcode</li>}
            </ul>
          </div>
        }
      />
    )
  }

  return (
    <Tooltip
      content={source.title ? `${source.title} is valid` : "Variant is valid"}
      side="top"
    >
      <CheckCircleFillIcon size={20} className="text-emerald-40" />
    </Tooltip>
  )
}

export default NewVariant
