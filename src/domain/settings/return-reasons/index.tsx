import { useAdminReturnReasons } from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import RadioGroup from "../../../components/organisms/radio-group"
import Spinner from "../../../components/atoms/spinner"
import TwoSplitPane from "../../../components/templates/two-split-pane"
import useModal from "../../../hooks/use-modal"
import CreateReturnReasonModal from "./create-reason-modal"
import ReturnReasonDetail from "./detail"

const ReturnReasons = () => {
  const { isOpen, handleOpen, handleClose } = useModal()
  const { isLoading, isSuccess, return_reasons } = useAdminReturnReasons()
  const sorted_return_reasons = useMemo(
    () =>
      return_reasons?.sort((a, b) => (a.created_at < b.created_at ? -1 : 1)),
    [return_reasons]
  )

  const [selectedReason, setSelectedReason] = useState(null)

  useEffect(() => {
    // if success && is not already selected && sorted_reasons is not empty
    if (isSuccess && !selectedReason && sorted_return_reasons.length > 0) {
      setSelectedReason(sorted_return_reasons[0])
    }
  }, [sorted_return_reasons])

  return (
    <div>
      <BreadCrumb
        previousRoute="/a/settings"
        previousBreadcrumb="Settings"
        currentPage="Return Reasons"
      />
      <TwoSplitPane>
        <BodyCard
          title="Return Reasons"
          actionables={[
            {
              label: "Add reason",
              icon: (
                <span className="text-grey-90">
                  <PlusIcon size={20} />
                </span>
              ),
              onClick: handleOpen,
            },
          ]}
          subtitle="Manage the markets that you will operate within"
        >
          <div className="mt-large">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Spinner variant="secondary" />
              </div>
            ) : (
              <RadioGroup
                onValueChange={value =>
                  setSelectedReason(
                    findReasonByValue(sorted_return_reasons, value)
                  )
                }
                value={selectedReason?.value}
              >
                {sorted_return_reasons.map(reason => (
                  <RadioGroup.Item
                    label={reason.label}
                    sublabel={reason.value}
                    description={reason.description}
                    className="mt-xsmall"
                    value={reason.value}
                  />
                ))}
              </RadioGroup>
            )}
          </div>
        </BodyCard>
        <ReturnReasonDetail reason={selectedReason} />
      </TwoSplitPane>
      {isOpen && <CreateReturnReasonModal handleClose={handleClose} />}
    </div>
  )
}

const findReasonByValue = (reasons, value) => {
  return reasons.find(reason => reason.value === value)
}

export default ReturnReasons
