import React from "react"

import { AdminGetBatchParams, BatchJob } from "@medusajs/medusa"
import { useAdminBatchJobs } from "medusa-react"

export const defaultPollingContext: {
  batchJobs?: BatchJob[]
  hasPollingError?: boolean
} = {}

export const PollingContext = React.createContext(defaultPollingContext)

const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1))
oneMonthAgo.setHours(0, 0, 0, 0)

/**
 * Intervals for refetching batch jobs in seconds.
 */
const INTERVALS = [1, 2, 5, 10, 15, 30, 60]

/**
 * Function factory for creating deduplicating timer object.
 * @param start - Initial starting point in the intervals array.
 */
const creeateDedupingTimer = (start: number) => {
  let deadline = Date.now()
  return {
    current: start,
    register() {
      deadline = Date.now()

      const currentInd = INTERVALS.findIndex((s) => s === this.current)
      this.current = INTERVALS[Math.min(INTERVALS.length - 1, currentInd + 1)]
    },
    isEnabled() {
      return Date.now() >= deadline
    },
  }
}

const Timer = creeateDedupingTimer(INTERVALS[0])

/**
 * Batch job polling context provides batch jobs to the context.
 * Jobs are refreshed with nonlinear intervals.
 */
export const PollingProvider = ({ children }) => {
  const {
    batch_jobs: batchJobs,
    isError: hasPollingError,
    refetch,
  } = useAdminBatchJobs(
    {
      created_at: { gte: oneMonthAgo },
      failed_at: null,
    } as AdminGetBatchParams,
    {
      refetchInterval: Timer.current * 1000,
      enabled: Timer.isEnabled(),
      onSettled: Timer.register.bind(Timer),
    }
  )

  const value = {
    batchJobs,
    hasPollingError,
    refetchJobs: refetch,
  }

  return (
    <PollingContext.Provider value={value}>{children}</PollingContext.Provider>
  )
}
