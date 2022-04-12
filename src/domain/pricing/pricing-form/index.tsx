import { navigate } from "gatsby"
import React from "react"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Accordion from "../../../components/organisms/accordion"
import Configuration from "./sections/configuration"
import General from "./sections/general"

const CreatePriceListForm = () => {
  const closeForm = () => navigate("/a/pricing")

  return (
    <FocusModal>
      <FocusModal.Header>
        <div className="medium:w-8/12 w-full px-8 flex justify-between">
          <Button
            size="small"
            variant="ghost"
            onClick={closeForm}
            className="border rounded-rounded w-8 h-8"
          >
            <CrossIcon size={20} />
          </Button>
          <div className="gap-x-small flex">
            <Button
              onClick={() => {}}
              size="small"
              variant="ghost"
              className="border rounded-rounded"
            >
              Save as draft
            </Button>
            <Button
              size="small"
              variant="primary"
              onClick={() => {}}
              className="rounded-rounded"
            >
              Publish price list
            </Button>
          </div>
        </div>
      </FocusModal.Header>
      <FocusModal.Main>
        <div className="flex justify-center mb-[25%]">
          <div className="medium:w-7/12 large:w-6/12 small:w-4/5 w-full pt-16">
            <h1 className="inter-xlarge-semibold mb-[28px]">
              Create new price list
            </h1>
            <Accordion type="multiple" defaultValue={["general"]}>
              <Accordion.Item
                forceMountContent
                required
                title="General"
                tooltip="General information for the price list. A name is required."
                value="general"
              >
                <General />
              </Accordion.Item>
              <Accordion.Item
                forceMountContent
                required
                title="Configuration"
                tooltip="Optional configuration for the price list"
                value="configuration"
                subtitle="The price overrides apply from the time you hit the publish button and forever if left untouched."
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

export default CreatePriceListForm
