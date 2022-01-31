import { navigate } from "gatsby"
import { useAdminCreateCollection } from "medusa-react"
import React from "react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import InfoTooltip from "../../../components/molecules/info-tooltip"
import InputField from "../../../components/molecules/input"
import BodyCard from "../../../components/organisms/body-card"
import useToaster from "../../../hooks/use-toaster"
import { getErrorMessage } from "../../../utils/error-messages"

type NewCollectionForm = {
  title: string
  handle?: string
}

const NewCollection = ({}) => {
  const createCollection = useAdminCreateCollection()
  const toaster = useToaster()
  const { register, handleSubmit } = useForm()

  const submit = (data: NewCollectionForm) => {
    createCollection.mutate(
      {
        title: data.title,
        handle: data.handle,
      },
      {
        onSuccess: (data) => {
          console.log(data)
          toaster("Successfully created collection", "success")
          navigate("/a/collections")
        },
        onError: (err) => {
          toaster(getErrorMessage(err), "error")
        },
      }
    )
  }

  return (
    <div className="max-w-[632px]">
      <form onSubmit={handleSubmit(submit)}>
        <Breadcrumb
          currentPage="Add Collection"
          previousRoute="/a/collections"
          previousBreadcrumb="Collections"
        />
        <BodyCard
          title="General"
          subtitle="To start selling, all you need is a name, price, and image."
          className="h-auto"
        >
          <div className="mt-large">
            <h3 className="inter-base-semibold mb-base">Details</h3>
            <div className="flex flex-col gap-y-base">
              <InputField
                ref={register({ required: true })}
                name="title"
                label="Title"
                placeholder="Sunglasses"
                required
              />
              <InputField
                ref={register}
                name="handle"
                label="Handle"
                tooltip={
                  <InfoTooltip
                    content={
                      "URL Slug for the product. Will be auto generated if left blank."
                    }
                  />
                }
                prefix="/"
                placeholder="sunglasses"
              />
            </div>
          </div>
        </BodyCard>
        <div className="flex items-center justify-end gap-x-xsmall mt-base">
          <Button
            variant="secondary"
            size="medium"
            type="button"
            onClick={() => navigate("/a/collections")}
          >
            Cancel
          </Button>
          <Button variant="primary" size="medium" type="submit">
            Publish collection
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NewCollection
