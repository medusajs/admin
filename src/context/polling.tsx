import React, { useContext, useEffect, useState } from "react"
import useNotification from "../hooks/use-notification"
import { useAdminBatchJobs } from "medusa-react"
import { AdminGetBatchParams } from "@medusajs/medusa"
import { getErrorMessage } from "../utils/error-messages"
import { BatchJob } from "@medusajs/medusa/dist"
import { AccountContext } from "./account"

export const defaultPollingContext: {
  batchJobs?: BatchJob[]
} = {
  batchJobs: [] as BatchJob[]
}

export const PollingContext = React.createContext(defaultPollingContext)

export const PollingProvider = ({ children }) => {
  const { isLoggedIn } = useContext(AccountContext)
  const notification = useNotification()

  const [shouldPollBatchJobs, setShouldPollBatchJobs] = useState(false)
  const [polledBatchJobs, setPolledBatchJobs] = useState<BatchJob[] | undefined>([])

  const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1))
  oneMonthAgo.setHours(0, 0, 0, 0);

  const {
    batch_jobs: batchJobs,
    error: listBatchJobsError
  } = useAdminBatchJobs({
    created_at: { gte: oneMonthAgo }
  } as AdminGetBatchParams, {
    refetchInterval: shouldPollBatchJobs ? 5000 : false,
    refetchIntervalInBackground: shouldPollBatchJobs
  } as any)

  useEffect(() => {
    if (!isLoggedIn) {
      setShouldPollBatchJobs(false)
      return
    }

    setPolledBatchJobs(batchJobs)

    const shouldPoll = !polledBatchJobs?.length
      || polledBatchJobs.some((batch: any): boolean => {
        return (!!batch.pre_processed_at || !!batch.processing_at)
          && !batch.completed
          && !batch.failed_at
          && !batch.canceled_at
      })

    setShouldPollBatchJobs(shouldPoll)

    if (listBatchJobsError) {
      notification(
        "Error listing the batch jobs during polling",
        getErrorMessage(listBatchJobsError),
        "error"
      )
    }
  }, [batchJobs, listBatchJobsError, isLoggedIn])

  const value = {
    batchJobs: polledBatchJobs,
  }

  return (
    <PollingContext.Provider value={value}>
      {children}
    </PollingContext.Provider>
  )
}
