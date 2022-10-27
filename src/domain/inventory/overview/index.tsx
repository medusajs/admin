import { RouteComponentProps } from "@reach/router"
import { useAdminCreateBatchJob } from "medusa-react"
import React, { useContext } from "react"
import Fade from "../../../components/atoms/fade-wrapper"
import Button from "../../../components/fundamentals/button"
import ExportIcon from "../../../components/fundamentals/icons/export-icon"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import UploadIcon from "../../../components/fundamentals/icons/upload-icon"
import BodyCard from "../../../components/organisms/body-card"
import ExportModal from "../../../components/organisms/export-modal"
import InventoryTable from "../../../components/templates/inventory-table"
import useToggleState from "../../../hooks/use-toggle-state"
import ImportProducts from "../batch-job/import"
import { PollingContext } from "../../../context/polling"

const Overview = () => {
  const {
    state: createProductState,
    open: openProductCreate,
  } = useToggleState()

  const { resetInterval } = useContext(PollingContext)
  const createBatchJob = useAdminCreateBatchJob()

  const CurrentAction = () => {
    return null

    // return (
    //   <div className="flex space-x-2">
    //     <Button
    //       variant="secondary"
    //       size="small"
    //       onClick={() => openImportModal()}
    //     >
    //       <UploadIcon size={20} />
    //       Import Products
    //     </Button>
    //     <Button
    //       variant="secondary"
    //       size="small"
    //       onClick={() => openExportModal()}
    //     >
    //       <ExportIcon size={20} />
    //       Export Products
    //     </Button>
    //     <Button variant="secondary" size="small" onClick={openProductCreate}>
    //       <PlusIcon size={20} />
    //       New Product
    //     </Button>
    //   </div>
    // )
  }

  // const {
  //   open: openExportModal,
  //   close: closeExportModal,
  //   state: exportModalOpen,
  // } = useToggleState(false)

  // const {
  //   open: openImportModal,
  //   close: closeImportModal,
  //   state: importModalOpen,
  // } = useToggleState(false)

  const handleCreateExport = () => {
    console.log("not implemented")
    return
    // const reqObj = {
    //   type: "product-export",
    //   context: {},
    //   dry_run: false,
    // }

    // createBatchJob.mutate(reqObj, {
    //   onSuccess: () => {
    //     resetInterval()
    //     notification("Success", "Successfully initiated export", "success")
    //   },
    //   onError: (err) => {
    //     notification("Error", getErrorMessage(err), "error")
    //   },
    // })

    // closeExportModal()
  }

  return (
    <>
      <div className="flex flex-col grow h-full">
        <div className="w-full flex flex-col grow">
          <BodyCard forceDropdown={false} customActionable={CurrentAction()}>
            <InventoryTable />
          </BodyCard>
        </div>
      </div>
      {/* exportModalOpen && (
        <ExportModal
          title="Export Products"
          handleClose={() => closeExportModal()}
          onSubmit={handleCreateExport}
          loading={createBatchJob.isLoading}
        />
      )}
      {importModalOpen && (
        <ImportProducts handleClose={() => closeImportModal()} />
        )*/}
      <Fade isVisible={createProductState} isFullScreen={true}>
        {/* <NewProduct onClose={closeProductCreate} /> */}
      </Fade>
    </>
  )
}

export default Overview
