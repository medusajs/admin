import { Router, useLocation } from "@reach/router"
import { navigate } from "gatsby"
import { useAdminCreateCollection } from "medusa-react"
import React, { useEffect, useState } from "react"
import ExportIcon from "../../components/fundamentals/icons/export-icon"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import ProductExport from "../../components/organisms/product-export"
import AddCollectionModal from "../../components/templates/collection-modal"
import CollectionsTable from "../../components/templates/collections-table"
import ProductTable from "../../components/templates/product-table"
import useNotification from "../../hooks/use-notification"
import useToggleState from "../../hooks/use-toggle-state"
import { getErrorMessage } from "../../utils/error-messages"
import EditProductPage from "./edit"
import NewProductPage from "./new"

const VIEWS = ["products", "collections"]

const ProductIndex = () => {
  const location = useLocation()
  const [view, setView] = useState("products")

  const notification = useNotification()

  const createCollection = useAdminCreateCollection()

  useEffect(() => {
    if (location.search.includes("?view=collections")) {
      setView("collections")
    }
  }, [location])

  useEffect(() => {
    location.search = ""
  }, [view])

  const CurrentView = () => {
    switch (view) {
      case "products":
        return <ProductTable />
      default:
        return <CollectionsTable />
    }
  }

  const CurrentAction = () => {
    switch (view) {
      case "products":
        return [
          {
            label: "Export",
            onClick: () => openExportModal(),
            icon: (
              <span className="text-grey-90">
                <ExportIcon size={20} />
              </span>
            ),
          },
          {
            label: "New Product",
            onClick: () => navigate("/a/products/new"),
            icon: (
              <span className="text-grey-90">
                <PlusIcon size={20} />
              </span>
            ),
          },
        ]
      default:
        return [
          {
            label: "New Collection",
            onClick: () => setShowNewCollection(!showNewCollection),
            icon: (
              <span className="text-grey-90">
                <PlusIcon size={20} />
              </span>
            ),
          },
        ]
    }
  }

  const [showNewCollection, setShowNewCollection] = useState(false)
  const {
    open: openExportModal,
    close: closeExportModal,
    state: exportModalOpen,
  } = useToggleState(false)

  const handleCreateCollection = async (data, colMetadata) => {
    const metadata = colMetadata
      .filter((m) => m.key && m.value) // remove empty metadata
      .reduce((acc, next) => {
        return {
          ...acc,
          [next.key]: next.value,
        }
      }, {})

    await createCollection.mutateAsync(
      { ...data, metadata },
      {
        onSuccess: ({ collection }) => {
          notification("Success", "Successfully created collection", "success")
          navigate(`/a/collections/${collection.id}`)
          setShowNewCollection(false)
        },
        onError: (err) => notification("Error", getErrorMessage(err), "error"),
      }
    )
  }

  return (
    <>
      <div className="flex flex-col grow h-full">
        <div className="w-full flex flex-col grow">
          <BodyCard
            forceDropdown={false}
            actionables={CurrentAction()}
            customHeader={
              <TableViewHeader
                views={VIEWS}
                setActiveView={setView}
                activeView={view}
              />
            }
          >
            <CurrentView />
          </BodyCard>
        </div>
      </div>
      {showNewCollection && (
        <AddCollectionModal
          onClose={() => setShowNewCollection(!showNewCollection)}
          onSubmit={handleCreateCollection}
        />
      )}
      {exportModalOpen && (
        <ProductExport
          handleClose={() => closeExportModal()}
          // onSubmit={handleCreateCollection}
        />
      )}
    </>
  )
}

const Products = () => {
  return (
    <Router>
      <ProductIndex path="/" />
      <EditProductPage path=":id" />
      <NewProductPage path="new" />
    </Router>
  )
}

export default Products
