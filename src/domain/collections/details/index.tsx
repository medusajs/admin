import { useAdminCollection } from "medusa-react"
import React from "react"
import { useForm } from "react-hook-form"
import Spinner from "../../../components/atoms/spinner"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import InfoTooltip from "../../../components/molecules/info-tooltip"
import InputField from "../../../components/molecules/input"
import BodyCard from "../../../components/organisms/body-card"
import { RouteComponentProps } from "@reach/router"
import Actionables from "../../../components/molecules/actionables"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Button from "../../../components/fundamentals/button"
import ReactJson from "react-json-view"

const CollectionDetails: React.FC<RouteComponentProps> = ({ location }) => {
  const ensuredPath = location!.pathname.replace("/a/collections/", ``)
  const { collection, isLoading, isError } = useAdminCollection(ensuredPath)

  const { register, unregister, setValue, handleSubmit, formState } = useForm()

  return (
    <div className="flex flex-col">
      <Breadcrumb
        currentPage="Edit Collection"
        previousBreadcrumb="Collections"
        previousRoute="/a/collections"
      />
      <div className="rounded-rounded py-large px-xlarge border border-grey-20 bg-grey-0 mb-large">
        {isLoading || !collection ? (
          <div className="flex items-center w-full h-12">
            <Spinner variant="secondary" size="large" />
          </div>
        ) : (
          <div>
            <div>
              <div className="flex items-center justify-between">
                <h2 className="inter-xlarge-semibold mb-2xsmall">
                  {collection.title}
                </h2>
                <Actionables
                  forceDropdown
                  actions={[
                    {
                      label: "Delete",
                      onClick: () => {},
                      variant: "danger",
                      icon: <TrashIcon size="20" />,
                    },
                  ]}
                />
              </div>
              <p className="inter-small-regular text-grey-50">
                /{collection.handle}
              </p>
            </div>
            {collection.metadata && (
              <div className="mt-large flex flex-col gap-y-base">
                <h3 className="inter-base-semibold">Metadata</h3>
                <div>
                  <ReactJson
                    name={false}
                    collapsed={true}
                    src={collection.metadata}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <BodyCard
        title="Products"
        subtitle="To start selling, all you need is a name, price, and image."
      ></BodyCard>
      <div className="flex items-center justify-end w-full mt-base gap-x-xsmall">
        <Button variant="secondary" size="small">
          Cancel
        </Button>
        <Button variant="primary" size="small">
          Save changes
        </Button>
      </div>
    </div>
  )
}

export default CollectionDetails
