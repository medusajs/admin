import { AdminGetBatchParams } from "@medusajs/medusa"
import { BatchJob } from "@medusajs/medusa/dist"
import { useAdminBatchJobs } from "medusa-react"
import React, { useContext, useEffect, useState } from "react"
import { AccountContext } from "./account"

export const defaultPollingContext: {
  batchJobs?: BatchJob[]
  hasPollingError?: boolean
} = {}

export const PollingContext = React.createContext(defaultPollingContext)

export const PollingProvider = ({ children }) => {
  const { isLoggedIn } = useContext(AccountContext)

  const [shouldPollBatchJobs, setShouldPollBatchJobs] = useState(false)
  const [polledBatchJobs, setPolledBatchJobs] = useState<
    BatchJob[] | undefined
  >()
  const [hasPollingError, setHasPollingError] = useState<boolean | undefined>()

  const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1))
  oneMonthAgo.setHours(0, 0, 0, 0)

  const {
    batch_jobs: batchJobs,
    isError: isBathJobPollingError,
    isFetching,
  } = useAdminBatchJobs(
    {
      created_at: { gte: oneMonthAgo },
      failed_at: null,
    } as AdminGetBatchParams,
    {
      refetchInterval: shouldPollBatchJobs ? 5000 : false,
      refetchOnWindowFocus: shouldPollBatchJobs,
    } as any
  )

  useEffect(() => {
    if (isFetching) {
      return
    }

    if (!isLoggedIn) {
      setShouldPollBatchJobs(false)
      return
    }

    setPolledBatchJobs(batchJobs)

    const shouldPoll =
      !polledBatchJobs?.length ||
      polledBatchJobs.some((batch: any): boolean => {
        return (
          (!!batch.pre_processed_at || !!batch.processing_at) &&
          !batch.completed &&
          !batch.failed_at &&
          !batch.canceled_at
        )
      })

    setShouldPollBatchJobs(shouldPoll)
    setHasPollingError(isBathJobPollingError)
  }, [batchJobs, isFetching, isBathJobPollingError, isLoggedIn])

  const value = {
    batchJobs: polledBatchJobs,
    hasPollingError,
  }

  return (
    <PollingContext.Provider value={value}>{children}</PollingContext.Provider>
  )
}
