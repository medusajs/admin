import * as React from "react"
import { useFormContext } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { useDiscountForm } from "./form/discount-form-context"
import { useFormActions } from "./form/use-form-actions"
import General from "./sections/general"
import Settings from "./sections/settings"

type DiscountFormProps = {
  discount?: any
  isEdit?: boolean
  closeForm?: () => void
}

const DiscountForm: React.FC<DiscountFormProps> = ({
  discount,
  closeForm,
  isEdit = false,
}) => {
  const notification = useNotification()
  const { handleSubmit } = useFormContext()
  const { startsAt, endsAt } = useDiscountForm()
  const { onSaveAsActive, onSaveAsInactive, onUpdate } = useFormActions(
    discount?.id,
    {
      ...discount,
      starts_at: startsAt,
      ends_at: endsAt,
    }
  )

  const submitGhost = async (data) => {
    if (!isEdit) {
      onSaveAsInactive(data)
        .then(() => {
          if (closeForm) {
            closeForm()
          }
        })
        .catch((error) => {
          notification("Error", getErrorMessage(error), "error")
        })
    } else {
      if (closeForm) {
        closeForm()
      }
    }
  }

  const submitCTA = async (data) => {
    try {
      if (isEdit) {
        await onUpdate(data)
      } else {
        await onSaveAsActive(data)
      }
      if (closeForm) {
        closeForm()
      }
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
        <div className="flex justify-center">
          <div className="medium:w-7/12 large:w-6/12 small:w-4/5 w-full">
            <div>
              <General discount={discount} isEdit={isEdit} />
            </div>
            <div className="mt-xlarge">
              <Settings isEdit={isEdit} />
            </div>
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default DiscountForm
