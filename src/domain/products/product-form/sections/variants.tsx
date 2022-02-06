import React from "react"
import Button from "../../../../components/fundamentals/button"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import InfoTooltip from "../../../../components/molecules/info-tooltip"
import Input from "../../../../components/molecules/input"
import TagInput from "../../../../components/molecules/tag-input"
import BodyCard from "../../../../components/organisms/body-card"
import { useProductForm } from "../form/product-form-context"

const Variants = () => {
  const { register } = useProductForm()
  const [variations, setVariations] = React.useState([])
  return (
    <BodyCard
      title="Variants"
      subtitle="Add variations of this product. Offer your customers different options for price, color, format, size, shape, etc."
    >
      <div className="mt-large">
        <div className="flex items-center mb-base">
          <h6 className="inter-base-semibold text-grey-90 mr-1.5">General</h6>
          <InfoTooltip
            content={
              "Add options to generate variants of a product. Options should be properties that differ across variants of the same product for example size or color."
            }
          />
        </div>
        <div className="max-w-[565px]">
          {Array(3)
            .fill(0)
            .map((_) => (
              <div className="last:mb-0 mb-xsmall flex items-center gap-x-1">
                <Input
                  required
                  name="title"
                  label="Option Title"
                  placeholder="Color, Size..."
                  ref={register}
                />
                <TagInput
                  required
                  placeholder="Blue, Green..."
                  name="variations"
                  label="Variations (separated by comma)"
                  values={variations}
                  onChange={(values) => {
                    setVariations(values)
                  }}
                />
                <button className="ml-large">
                  <TrashIcon
                    // onClick={onClickDelete(index)}
                    className="text-grey-40"
                    size="20"
                  />
                </button>
              </div>
            ))}
        </div>
        <div className="mt-large mb-small">
          <Button
            // onClick={appendDenomination}
            type="button"
            variant="ghost"
            size="small"
            // disabled={availableCurrencies.length === 0}
          >
            <PlusIcon size={20} />
            Add a price
          </Button>
        </div>
      </div>
    </BodyCard>
  )
}

export default Variants
