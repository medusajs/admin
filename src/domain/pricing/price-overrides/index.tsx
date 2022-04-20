import { MoneyAmount, Product } from "@medusajs/medusa"
import React, { useContext } from "react"
import { Controller, useForm } from "react-hook-form"
import Checkbox from "../../../components/atoms/checkbox"
import Button from "../../../components/fundamentals/button"
import ChevronRightIcon from "../../../components/fundamentals/icons/chevron-right-icon"
import EyeIcon from "../../../components/fundamentals/icons/eye-icon"
import EyeOffIcon from "../../../components/fundamentals/icons/eye-off-icon"
import { CollapsibleTree } from "../../../components/molecules/collapsible-tree"
import Modal from "../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../components/molecules/modal/layered-modal"
import PriceInput from "../../../components/organisms/price-input"
import RadioGroup from "../../../components/organisms/radio-group"
import useToggleState from "../../../hooks/use-toggle-state"
import { currencies } from "../../../utils/currencies"

type PricesOverridesModalProps = {
  product: Product
  close: () => void
}

function PricesOverridesModal({ close, product }: PricesOverridesModalProps) {
  const layeredModalContext = useContext(LayeredModalContext)

  const getOnClick = (variant) => () =>
    layeredModalContext.push({
      title: `Edit price overrides`,
      onBack: () => layeredModalContext.pop(),
      view: (
        <EditPriceOverrides
          prices={variant.prices}
          product={product}
          onClose={close}
        />
      ),
    })

  return (
    <LayeredModal
      isLargeModal
      context={layeredModalContext}
      handleClose={close}
    >
      <Modal.Body className="h-[calc(100vh-134px)] flex flex-col">
        <Modal.Header handleClose={close}>
          <h1 className="inter-xlarge-semibold">
            Price overrides{" "}
            <span className="text-grey-50 inter-xlarge-regular truncate">
              ({product.title})
            </span>
          </h1>
        </Modal.Header>

        <Modal.Content className="flex-1">
          <CollapsibleTree>
            <CollapsibleTree.Parent>
              <div>
                <img src={product.thumbnail} className="w-4 h-5 rounded-base" />
              </div>
              <span className="inter-small-semibold">{product.title}</span>
            </CollapsibleTree.Parent>
            <CollapsibleTree.Content>
              {product.variants.map((variant) => (
                <CollapsibleTree.Leaf>
                  <ProductVariantLeaf
                    key={variant.id}
                    onClick={getOnClick(variant)}
                    {...variant}
                  />
                </CollapsibleTree.Leaf>
              ))}
            </CollapsibleTree.Content>
          </CollapsibleTree>
        </Modal.Content>

        <Modal.Footer>
          <div className="flex w-full h-8 justify-end">
            <Button
              variant="ghost"
              className="mr-2 w-32 text-small justify-center rounded-rounded"
              size="large"
              onClick={close}
            >
              Cancel
            </Button>
            <Button
              disabled
              size="large"
              className="w-32 text-small justify-center rounded-rounded"
              variant="primary"
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

const ProductVariantLeaf = ({ sku, title, onClick, prices = [] }) => {
  return (
    <div className="flex flex-1 items-center">
      <div className="truncate">
        <span>{title}</span>
        {sku && <span className="text-grey-50 ml-xsmall">(SKU: {sku})</span>}
      </div>
      <div className="flex items-center text-grey-50 flex-1 justify-end">
        <div className="text-grey-50 mr-xsmall">
          {prices.length ? (
            <span>{`${prices.length} price${
              prices.length > 1 ? "s" : ""
            }`}</span>
          ) : (
            <span className="inter-small-semibold text-orange-40">
              Add prices
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="small"
          className="w-[32px] h-[32px]"
          onClick={onClick}
        >
          <ChevronRightIcon className="text-grey-40" />
        </Button>
      </div>
    </div>
  )
}

const MODES = {
  APPLY_ALL: "all",
  SELECTED_ONLY: "selected",
}

type EditPriceOverridesType = {
  onClose: () => void
  prices: MoneyAmount[]
  product: Product
}

const EditPriceOverrides = ({
  onClose,
  prices,
  product,
}: EditPriceOverridesType) => {
  const [mode, setMode] = React.useState(MODES.SELECTED_ONLY)
  const { handleSubmit, control } = useForm({
    defaultValues: {
      variants: [],
      prices,
    },
  })

  const onClick = () => {
    handleSubmit((data) => console.log(data))()
  }
  return (
    <>
      <Modal.Content isLargeModal={true}>
        <RadioGroup.Root
          value={mode}
          onValueChange={(value) => setMode(value)}
          className="pt-2 flex items-center"
        >
          <RadioGroup.SimpleItem
            value={MODES.SELECTED_ONLY}
            label="Apply overrides on selected variants"
          />
          <RadioGroup.SimpleItem
            value={MODES.APPLY_ALL}
            label="Apply on all variants"
          />
        </RadioGroup.Root>
        {mode === MODES.SELECTED_ONLY && (
          <div className="pt-6 flex flex-col gap-2">
            {product.variants.map((variant, idx) => (
              <div
                id={variant.id}
                className="py-2.5 px-3 border border-grey-20 rounded-rounded"
              >
                <Controller
                  control={control}
                  name={`variants[${idx}]`}
                  render={(field) => {
                    return (
                      <Checkbox
                        className="shrink-0 inter-small-regular"
                        label={`${variant.title} (SKU: ${variant.sku})`}
                        {...field}
                        name="variants"
                        checked={field.value === variant.id}
                        onChange={(e) =>
                          field.onChange(
                            e.target.checked ? variant.id : undefined
                          )
                        }
                      />
                    )
                  }}
                />
              </div>
            ))}
          </div>
        )}
        <div className="pt-8">
          <h6 className="inter-base-semibold">Prices</h6>
          <div className="pt-4">
            {prices.map((price, idx) => (
              <Controller
                control={control}
                name={`prices[${idx}]`}
                key={price.id}
                render={(field) => {
                  return (
                    <PriceAmount
                      value={field.value}
                      onChange={(amount) => {
                        field.onChange({
                          ...field.value,
                          amount,
                        })
                      }}
                    />
                  )
                }}
              />
            ))}
          </div>
        </div>
      </Modal.Content>
      <Modal.Footer isLargeModal>
        <div className="flex w-full h-8 justify-end">
          <Button
            variant="ghost"
            className="mr-2 w-32 text-small justify-center rounded-rounded"
            size="large"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            size="large"
            className="text-small justify-center rounded-rounded"
            variant="primary"
            onClick={onClick}
          >
            Save and close
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

const PriceAmount = ({ value, onChange }) => {
  const { state: showRegions, toggle } = useToggleState()
  console.log({ value })
  return (
    <div className="flex flex-col gap-3 py-3 first:border-t border-grey-20 border-solid border-b last:border-b-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inter-base-semibold">
            <span className="mr-2 uppercase">{value.currency_code}</span>
            <span className="inter-base-regular text-grey-50 capitalize">
              {value.currency?.name}
            </span>
          </div>
          {value.region?.countries ? (
            <Button
              variant="secondary"
              size="small"
              className="rounded-rounded h-[32px]"
              onClick={toggle}
            >
              <div className="flex items-center gap-2">
                {showRegions ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                <span>Show regions</span>
              </div>
            </Button>
          ) : null}
        </div>
        <div className="basis-[220px]">
          <PriceInput
            amount={value.amount}
            onAmountChange={onChange}
            currency={currencies[value.currency_code.toUpperCase()]}
          />
        </div>
      </div>

      {showRegions && (
        <ul>
          {value.region?.countries.map((country) => (
            <li key={country.id} className="flex items-center justify-between">
              <div>
                <p className="inter-base-regular text-grey-50">
                  {country.display_name}
                </p>
              </div>
              <div className="basis-[220px]">
                <PriceInput
                  amount={600}
                  currency={{
                    code: "eur",
                    name: "Euro",
                    decimal_digits: 2,
                    symbol: "€",
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PricesOverridesModal
