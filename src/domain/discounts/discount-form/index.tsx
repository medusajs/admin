import { Discount } from "@medusajs/medusa"
import { navigate } from "gatsby"
import * as React from "react"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Accordion from "../../../components/organisms/accordion"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { useDiscountForm } from "./form/discount-form-context"
import { DiscountFormValues } from "./form/mappers"
import { useFormActions } from "./form/use-form-actions"
import Conditions from "./sections/conditions"
import Configuration from "./sections/configuration"
import General from "./sections/general"
import PromotionType from "./sections/promotion-type"

type DiscountFormProps = {
  discount?: Discount
  isEdit?: boolean
  additionalOpen?: string[]
  closeForm?: () => void
}

const DiscountForm: React.FC<DiscountFormProps> = ({
  discount,
  closeForm,
  additionalOpen = [],
  isEdit = false,
}) => {
  const notification = useNotification()
  const { handleSubmit, conditions, handleReset } = useDiscountForm()
  const dialog = useImperativeDialog()

  const {
    onSaveAsActive,
    onSaveAsInactive,
    onUpdate,
    onRemoveConditions,
  } = useFormActions(discount?.id!, {
    discount,
  })

  const closeFormModal = () => {
    if (closeForm) {
      closeForm()
    } else {
      navigate("/a/discounts")
    }
    handleReset()
  }

  const submitGhost = async (data: DiscountFormValues) => {
    if (!isEdit) {
      onSaveAsInactive(data)
        .then(() => {
          closeFormModal()
          handleReset()
        })
        .catch((error) => {
          notification("Error", getErrorMessage(error), "error")
        })
    } else {
      closeFormModal()
      handleReset()
    }
  }

  const submitCTA = async (data: DiscountFormValues) => {
    try {
      if (isEdit) {
        const conditionsToDelete = Object.values(conditions).filter(
          (condition) => condition.shouldDelete && condition.id
        )

        if (conditionsToDelete.length > 0) {
          const shouldDelete = await dialog({
            text: `Are you sure you want to delete ${
              conditionsToDelete.length
            } ${conditionsToDelete.length > 1 ? "conditions" : "condtion"}?`,
            heading: "Delete conditions",
          })

          if (!shouldDelete) {
            return
          }

          await onRemoveConditions(conditionsToDelete)
        }
        await onUpdate(data)
      } else {
        await onSaveAsActive(data)
      }
      closeFormModal()
      handleReset()
    } catch (error) {
      notification("Error", getErrorMessage(error), "error")
    }
  }

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
              onClick={handleSubmit(submitGhost)}
              size="small"
              variant="ghost"
              className="border rounded-rounded"
            >
              {isEdit ? "Cancel" : "Save as draft"}
            </Button>
            <Button
              size="small"
              variant="primary"
              onClick={handleSubmit(submitCTA)}
              className="rounded-rounded"
            >
              {isEdit ? "Save changes" : "Publish promotion"}
            </Button>
          </div>
        </div>
      </FocusModal.Header>
      <FocusModal.Main>
        <div className="flex justify-center mb-[25%]">
          <div className="medium:w-7/12 large:w-6/12 small:w-4/5 w-full pt-16">
            <h1 className="inter-xlarge-semibold">
              {isEdit ? "Edit promotion" : "Create new promotion"}
            </h1>
            <Accordion
              className="pt-7 text-grey-90"
              defaultValue={["promotion-type", ...additionalOpen]}
              type="multiple"
            >
              {!isEdit && (
                <Accordion.Item
                  forceMountContent
                  title="Promotion type"
                  required
                  tooltip="Select a promotion type"
                  value="promotion-type"
                >
                  <PromotionType />
                </Accordion.Item>
              )}
              <Accordion.Item
                title="General"
                required
                value="general"
                forceMountContent
              >
                <General discount={discount} />
              </Accordion.Item>
              <Accordion.Item
                forceMountContent
                title="Configuration"
                value="configuration"
                description="Promotion code applies from you hit the publish button and forever if left untouched."
              >
                <Configuration promotion={discount} isEdit={isEdit} />
              </Accordion.Item>
              <Accordion.Item
                forceMountContent
                title="Conditions"
                description="Promotion code apply to all products if left untouched."
                value="conditions"
                tooltip="Add conditions to your Promotion"
              >
                <Conditions discount={discount} />
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default DiscountForm
