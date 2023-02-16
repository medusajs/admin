import React, { useState } from "react"

import useNotification from "../../../hooks/use-notification"
import { useAdminCreateProductCategory } from "../../../../../medusa/packages/medusa-react"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import InputField from "../../../components/molecules/input"
import Select from "../../../components/molecules/select"
import { ProductCategory } from "@medusajs/medusa"

const visibilityOptions = [
  {
    label: "Public",
    value: "public",
  },
  { label: "Private", value: "private" },
]

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
]

type CreateProductCategoryProps = {
  closeModal: () => void
  parentCategory?: ProductCategory
}

/**
 * Focus modal container for creating Publishable Keys.
 */
function CreateProductCategory(props: CreateProductCategoryProps) {
  const { closeModal, parentCategory } = props
  const notification = useNotification()

  const [name, setName] = useState("")
  const [handle, setHandle] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isPublic, setIsPublic] = useState(true)

  const { mutateAsync: createProductCategory } = useAdminCreateProductCategory()

  const onSubmit = async () => {
    try {
      await createProductCategory({
        name,
        is_active: isActive,
        is_internal: !isPublic,
        parent_category_id: parentCategory?.id ?? null,
      })
      closeModal()
      notification("Success", "Created a new product category", "success")
    } catch (e) {
      notification("Error", "Failed to create a new API key", "error")
    }
  }

  return (
    <FocusModal>
      <FocusModal.Header>
        <div className="medium:w-8/12 w-full px-8 flex justify-between">
          <Button size="small" variant="ghost" onClick={closeModal}>
            <CrossIcon size={20} />
          </Button>
          <div className="gap-x-small flex">
            <Button
              size="small"
              variant="primary"
              onClick={onSubmit}
              disabled={!name}
              className="rounded-rounded"
            >
              Save category
            </Button>
          </div>
        </div>
      </FocusModal.Header>

      <FocusModal.Main className="w-full no-scrollbar flex justify-center">
        <div className="medium:w-7/12 large:w-6/12 small:w-4/5 max-w-[700px] my-16">
          <h1 className="inter-xlarge-semibold text-grey-90 pb-8">
            Add category {parentCategory && `to ${parentCategory.name}`}
          </h1>
          <h4 className="inter-large-semibold text-grey-90 pb-1">Details</h4>

          <div className="flex justify-between gap-6 mb-8">
            <InputField
              label="Name"
              type="string"
              name="name"
              value={name}
              className="w-[338px]"
              placeholder="Give this category a name"
              onChange={(ev) => setName(ev.target.value)}
            />

            <InputField
              label="Handle"
              type="string"
              name="handle"
              value={handle}
              className="w-[338px]"
              placeholder="Custom handle"
              onChange={(ev) => setHandle(ev.target.value)}
            />
          </div>

          <div className="flex justify-between gap-6 mb-8">
            <div className="flex-1">
              <Select
                label="Status"
                options={statusOptions}
                value={statusOptions[isActive ? 0 : 1]}
                onChange={(o) => setIsActive(o.value === "active")}
              />
            </div>

            <div className="flex-1">
              <Select
                label="Visibility"
                options={visibilityOptions}
                value={visibilityOptions[isPublic ? 0 : 1]}
                onChange={(o) => setIsPublic(o.value === "public")}
              />
            </div>
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default CreateProductCategory
