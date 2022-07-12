import React, { useState } from "react"
import { useAdminCreateSalesChannel } from "medusa-react"

import Button from "../../../components/fundamentals/button"

import FocusModal from "../../../components/molecules/modal/focus-modal"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import Accordion from "../../../components/organisms/accordion"
import InputField from "../../../components/molecules/input"

type GeneralProps = {
  name: string
  description: string
  setName: (name: string) => void
  setDescription: (description: string) => void
}

function General(props: GeneralProps) {
  const { name, description, setName, setDescription } = props

  return (
    <div className="flex flex-col gap-y-base my-base">
      <div className="flex-1">
        <InputField
          required
          label="Title"
          type="string"
          name="name"
          placeholder="Website, app, Amazon, physical store POS, facebook product feed..."
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
      </div>
      <div className="flex-1">
        <InputField
          required
          label="Description"
          type="string"
          name="description"
          placeholder="Available products at our website, app..."
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
      </div>
    </div>
  )
}

type AddSalesChannelModalProps = {
  onClose: () => void
}

const AddSalesChannelModal = ({ onClose }: AddSalesChannelModalProps) => {
  const [name, setName] = useState<string>()
  const [description, setDescription] = useState<string>()
  const { mutate: createSalesChannel } = useAdminCreateSalesChannel()

  async function save() {
    await createSalesChannel({ name, description })
    onClose()
  }

  return (
    <FocusModal>
      <FocusModal.Header>
        <div className="medium:w-8/12 w-full px-8 flex justify-between">
          <Button
            size="small"
            variant="ghost"
            onClick={onClose}
            className="border rounded-rounded w-8 h-8"
          >
            <CrossIcon size={20} />
          </Button>
          <div className="gap-x-small flex">
            {/*<Button*/}
            {/*  onClick={() => save()}*/}
            {/*  size="small"*/}
            {/*  variant="ghost"*/}
            {/*  className="border rounded-rounded"*/}
            {/*>*/}
            {/*  Save as draft*/}
            {/*</Button>*/}
            <Button
              size="small"
              variant="primary"
              onClick={() => save()}
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
            <h1 className="inter-xlarge-semibold">Create new sales channel</h1>
            <Accordion
              className="pt-7 text-grey-90"
              defaultValue={["general"]}
              type="multiple"
            >
              <Accordion.Item
                title="General info"
                required
                value="general"
                forceMountContent
              >
                <General
                  name={name}
                  description={description}
                  setName={setName}
                  setDescription={setDescription}
                />
              </Accordion.Item>
              <Accordion.Item
                forceMountContent
                title="Products"
                value="products"
              ></Accordion.Item>
            </Accordion>
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default AddSalesChannelModal
