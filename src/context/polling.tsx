import React, { useEffect, useState } from "react"
import useNotification from "../hooks/use-notification"
import { useAdminBatchJobs } from "medusa-react"
import { AdminGetBatchParams } from "@medusajs/medusa"
import { getErrorMessage } from "../utils/error-messages"
import { BatchJob } from "@medusajs/medusa/dist"

export const defaultPollingContext: {
  batchJobsPolling?: BatchJob[]
} = {
  batchJobsPolling: [] as BatchJob[]
}

export const PollingContext = React.createContext(defaultPollingContext)

export const PollingProvider = ({ children }) => {
  const notification = useNotification()

  const [shouldPollBatchJobs, setShouldPollBatchJobs] = useState(true)
  const [batchJobs, setBatchJobs] = useState<BatchJob[] | undefined>([])

  const {
    batch_jobs,
    error: listBatchJobsError
  } = useAdminBatchJobs({} as AdminGetBatchParams, {
    refetchInterval: shouldPollBatchJobs ? 5000 : false,
    refetchIntervalInBackground: shouldPollBatchJobs
  } as any)

  useEffect(() => {
    setBatchJobs(batch_jobs)

    if (batch_jobs?.length) {
      const shouldPoll = !batch_jobs?.length
        || batch_jobs.some((batch: any): boolean => {
          return (!!batch.pre_processed_at || !!batch.processing_at)
            && !batch.completed
            && !batch.failed_at
            && !batch.canceled_at
        })
      setShouldPollBatchJobs(shouldPoll)
    }

    if (listBatchJobsError) {
      notification("Error listing the batch jobs during polling", getErrorMessage(listBatchJobsError), "error")
    }
  }, [batch_jobs, listBatchJobsError])

  const value = {
    batchJobsPolling: batchJobs,
  }

  return (
    <PollingContext.Provider value={value}>
      {children}
    </PollingContext.Provider>
  )
}
