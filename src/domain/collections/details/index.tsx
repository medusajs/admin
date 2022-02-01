import { useAdminCollection } from "medusa-react"
import React from "react"
import { useForm } from "react-hook-form"
import Spinner from "../../../components/atoms/spinner"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import InfoTooltip from "../../../components/molecules/info-tooltip"
import InputField from "../../../components/molecules/input"
import BodyCard from "../../../components/organisms/body-card"

type CollectionDetailsProps = {
  id: string
}

const CollectionDetails: React.FC<CollectionDetailsProps> = ({ id }) => {
  const { collection, isLoading } = useAdminCollection(id)

  const { register, unregister, setValue, handleSubmit } = useForm()

  return (
    <div className="flex flex-col">
      <Breadcrumb
        currentPage="Edit Collection"
        previousBreadcrumb="Collections"
        previousRoute="/a/collections"
      />
      <BodyCard
        title="General"
        subtitle="To start selling, all you need is a name, price, and image."
        className="h-auto mb-large"
      >
        {isLoading || !collection ? (
          <div className="flex items-center w-full h-12">
            <Spinner size="large" />
          </div>
        ) : (
          <div>
            <InputField
              label="Title"
              defaultValue={collection.title}
              required
            />
            <InputField
              label="Handle"
              defaultValue={collection.handle}
              prefix="/"
              tooltip={
                <InfoTooltip content="URL Slug for the product. Will be auto generated if left blank." />
              }
            />
          </div>
        )}
      </BodyCard>
      <BodyCard
        title="Products"
        subtitle="To start selling, all you need is a name, price, and image."
      ></BodyCard>
    </div>
  )
}

export default CollectionDetails
