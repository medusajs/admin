import React from "react"
import Button from "../../../../components/fundamentals/button"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import Accordion from "../../../../components/organisms/accordion"

const Prices = () => {
  return (
    <Accordion.Item
      forceMountContent
      required
      value="prices"
      title="Prices"
      subtitle="You will be able to override the prices for the products you add here"
      tooltip="Define the price overrides for the price list"
    >
      <div className="mt-5">
        <Button
          variant="secondary"
          size="small"
          className="w-full rounded-rounded"
        >
          <PlusIcon />
          Add Products Manually
        </Button>
      </div>
    </Accordion.Item>
  )
}

export default Prices
