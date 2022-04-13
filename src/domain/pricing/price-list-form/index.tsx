import * as React from "react"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Accordion from "../../../components/organisms/accordion"

const PriceListForm = ({ priceList, close }) => {
  return (
    <FocusModal>
      <FocusModal.Header>
        <div className="medium:w-8/12 w-full px-8 flex justify-between">
          <Button
            size="small"
            variant="ghost"
            onClick={() => {}}
            className="border rounded-rounded w-8 h-8"
          >
            <CrossIcon size={20} />
          </Button>
          <div className="gap-x-small flex">
            <Button
              onClick={() => {}}
              size="small"
              variant="primary"
              className="rounded-rounded"
            >
              Save changes
            </Button>
          </div>
        </div>
      </FocusModal.Header>
      <FocusModal.Main>
        <div className="flex justify-center mb-[25%]">
          <div className="medium:w-7/12 large:w-6/12 small:w-4/5 w-full pt-16">
            <h1 className="inter-xlarge-semibold">Edit price list details</h1>
            <Accordion
              className="pt-7 text-grey-90"
              defaultValue={["promotion-type"]}
              type="multiple"
            >
              <Accordion.Item
                title="General"
                required
                value="general"
                forceMountContent
              >
                <General />
              </Accordion.Item>
              <Accordion.Item
                forceMountContent
                title="Configuration"
                value="configuration"
                tooltip="Blablabla"
                description="The price overrides apply from the time you hit the publish button and forever if left untouched."
              >
                <Configuration />
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

const General = () => {
  return <>general</>
}

const Configuration = () => {
  return <>Configuration</>
}

export default PriceListForm
