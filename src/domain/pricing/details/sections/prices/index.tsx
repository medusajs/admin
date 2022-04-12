import * as React from "react"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import UploadIcon from "../../../../../components/fundamentals/icons/upload-icon"
import BodyCard from "../../../../../components/organisms/body-card"
import UploadModal from "../../../../../components/organisms/upload-modal"
import PricesTable from "./prices-table/"

const Prices = ({ id }) => {
  const [showEdit, setShowEdit] = React.useState(false)
  const [showUpload, setShowUpload] = React.useState(false)
  const actionables = [
    {
      label: "Edit manually",
      onClick: () => {
        setShowEdit(true)
      },
      icon: <EditIcon size={20} />,
    },
    {
      label: "Import price list",
      onClick: () => setShowUpload(true),
      icon: <UploadIcon size={20} />,
    },
  ]
  return (
    <BodyCard
      title="Prices"
      actionables={actionables}
      forceDropdown
      className="min-h-[200px]"
    >
      <PricesTable id={id} />
      {showEdit && <>{/* TODO: Edit prices focus modal */}</>}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUploadComplete={() => {}}
          fileTitle="price list"
          actionButtonText="Add Products Manually"
          description1Text="You can add to or 'update' a price list. A new import will update products with the same SKU. New products will be implemented as Drafts. Updated products will keep their current status."
          description2Title="Unsure about how to arrange your list?"
          description2Text="We have created a template file for you. Type in your own information and experience how much time and frustration this functionality can save you. Feel free to reach out if you have any questions."
        />
      )}
    </BodyCard>
  )
}

export default Prices
