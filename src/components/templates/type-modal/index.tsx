import { ProductType } from "@medusajs/medusa"
import {
  useAdminCreateProductType,
  useAdminUpdateProductType,
} from "medusa-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"
import Metadata, { MetadataField } from "../../organisms/metadata"

type TypeModalProps = {
  onClose: () => void
  onSubmit: (values: any, metadata: MetadataField[]) => void
  isEdit?: boolean
  type?: ProductType
}

type TypeModalFormData = {
  value: string
}

const TypeModal: React.FC<TypeModalProps> = ({
  onClose,
  isEdit = false,
  type,
}) => {
  const { mutate: update, isLoading: updating } = useAdminUpdateProductType(
    type?.id!
  )
  const { mutate: create, isLoading: creating } = useAdminCreateProductType()

  const { register, handleSubmit, reset } = useForm<TypeModalFormData>()

  const notification = useNotification()
  const [metadata, setMetadata] = useState<MetadataField[]>([])

  if (isEdit && !type) {
    throw new Error("Type is required for edit")
  }

  useEffect(() => {
    register("value", { required: true })
  }, [])

  useEffect(() => {
    if (isEdit && type) {
      reset({
        value: type.value,
      })

      if (type.metadata) {
        Object.entries(type.metadata).map(([key, value]) => {
          if (typeof value === "string") {
            const newMeta = metadata
            newMeta.push({ key, value })
            setMetadata(newMeta)
          }
        })
      }
    }
  }, [type, isEdit])

  const submit = (data: TypeModalFormData) => {
    if (isEdit) {
      update(
        {
          value: data.value,
          metadata: metadata.reduce((acc, next) => {
            return {
              ...acc,
              [next.key]: next.value,
            }
          }, {}),
        },
        {
          onSuccess: () => {
            notification("Success", "Successfully updated type", "success")
            onClose()
          },
          onError: (error) => {
            notification("Error", getErrorMessage(error), "error")
          },
        }
      )
    } else {
      create(
        {
          value: data.value,
          metadata: metadata.reduce((acc, next) => {
            return {
              ...acc,
              [next.key]: next.value,
            }
          }, {}),
        },
        {
          onSuccess: () => {
            notification("Success", "Successfully created type", "success")
            onClose()
          },
          onError: (error) => {
            notification("Error", getErrorMessage(error), "error")
          },
        }
      )
    }
  }

  return (
    <Modal handleClose={onClose} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <div>
            <h1 className="inter-xlarge-semibold mb-2xsmall">
              {isEdit ? "Edit Type" : "Add Type"}
            </h1>
            <p className="inter-small-regular text-grey-50">
              To create a type, all you need is a value.
            </p>
          </div>
        </Modal.Header>
        <form onSubmit={handleSubmit(submit)}>
          <Modal.Content>
            <div>
              <h2 className="inter-base-semibold mb-base">Details</h2>
              <div className="flex items-center gap-x-base">
                <InputField
                  label="Title"
                  required
                  placeholder="Sunglasses"
                  {...register("value", { required: true })}
                />
              </div>
            </div>
            <div className="mt-xlarge w-full">
              <Metadata setMetadata={setMetadata} metadata={metadata} />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full gap-x-xsmall">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                loading={isEdit ? updating : creating}
              >
                {`${isEdit ? "Save" : "Publish"} type`}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default TypeModal
