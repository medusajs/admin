import { RouteComponentProps, Router } from "@reach/router"
import React, { useMemo } from "react"
import { navigate } from "gatsby"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import OrderTable from "../../components/templates/order-table"
import Button from "../../components/fundamentals/button"
import Details from "./details"
import ExportIcon from "../../components/fundamentals/icons/export-icon"
import useToggleState from "../../hooks/use-toggle-state"
import { useAdminCreateBatchJob } from "medusa-react"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"
import ExportModal from "../../components/organisms/export-modal"

const VIEWS = ["orders", "drafts"]

const OrderIndex: React.FC<RouteComponentProps> = () => {
  const view = "orders"

  const createBatchJob = useAdminCreateBatchJob()
  const notification = useNotification()

  const {
    open: openExportModal,
    close: closeExportModal,
    state: exportModalOpen,
  } = useToggleState(false)

  const actions = useMemo(() => {
    return [
      <Button
        variant="secondary"
        size="small"
        onClick={() => openExportModal()}
      >
        <ExportIcon size={20} />
        Export List
      </Button>,
    ]
  }, [view])

  const handleCreateExport = () => {
    const reqObj = {
      type: "order-export",
      context: {},
      dry_run: false,
    }

    createBatchJob.mutate(reqObj, {
      onSuccess: () => {
        notification("Success", "Successfully initiated export", "success")
      },
      onError: (err) => {
        notification("Error", getErrorMessage(err), "error")
      },
    })

    closeExportModal()
  }

  return (
    <>
      <div className="flex flex-col grow h-full">
        <div className="w-full flex flex-col grow">
          <BodyCard
            customHeader={
              <TableViewHeader
                views={VIEWS}
                setActiveView={(v) => {
                  if (v === "drafts") {
                    navigate(`/a/draft-orders`)
                  }
                }}
                activeView={view}
              />
            }
            customActionable={actions}
          >
            <OrderTable />
          </BodyCard>
        </div>
      </div>
      {exportModalOpen && (
        <ExportModal
          title="Export Orders"
          handleClose={() => closeExportModal()}
          onSubmit={handleCreateExport}
          loading={createBatchJob.isLoading}
        />
      )}
    </>
  )
}

const Orders = () => {
  return (
    <Router>
      <OrderIndex path="/" />
      <Details path=":id" />
    </Router>
  )
}

export default Orders
