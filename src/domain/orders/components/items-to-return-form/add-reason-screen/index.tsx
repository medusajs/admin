import { useAdminReturnReasons } from "medusa-react"
import React, { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { ReturnReasonDetails } from ".."
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import { useLayeredModal } from "../../../../../components/molecules/modal/layered-modal"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import TextArea from "../../../../../components/molecules/textarea"

type Props = {
  reasonDetails: ReturnReasonDetails
  addReasonDetails: (index: number, details: ReturnReasonDetails) => void
  index: number
  isClaim?: boolean
}

const AddReasonScreen = ({
  reasonDetails,
  index,
  isClaim = false,
  addReasonDetails,
}: Props) => {
  const { return_reasons } = useAdminReturnReasons()
  const returnReasonOptions = useMemo(() => {
    return (
      return_reasons?.map((reason) => ({
        label: reason.label,
        value: reason.id,
      })) || []
    )
  }, [return_reasons])

  const {
    control,
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ReturnReasonDetails>({
    defaultValues: reasonDetails,
  })

  const { pop } = useLayeredModal()

  const onSubmit = handleSubmit((data) => {
    addReasonDetails(index, data)
    pop()
  })

  return (
    <>
      <Modal.Content>
        <div className="flex flex-col gap-y-base">
          <h2 className="inter-base-semibold">Reason for Return</h2>
          <Controller
            control={control}
            name="reason"
            render={({ field }) => {
              return (
                <NextSelect
                  label="Reason"
                  placeholder="Choose a return reason"
                  {...field}
                  options={returnReasonOptions}
                  isClearable
                />
              )
            }}
          />
          <TextArea
            label="Note"
            placeholder="Product was damaged during shipping"
            {...register("note")}
          />
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="w-full flex items-center justify-end gap-x-xsmall">
          <Button size="small" variant="secondary" onClick={pop} type="button">
            Cancel
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={onSubmit}
            disabled={!isDirty}
            type="button"
          >
            Save and go back
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

const useAddReasonScreen = () => {
  const { pop, push } = useLayeredModal()

  const pushScreen = (props: Props) => {
    push({
      title: "Select Reason",
      onBack: () => pop(),
      view: <AddReasonScreen {...props} />,
    })
  }

  return { pushScreen }
}

export default useAddReasonScreen
