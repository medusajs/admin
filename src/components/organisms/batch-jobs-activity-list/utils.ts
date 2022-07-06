import { BatchJob } from "@medusajs/medusa/dist"

export function batchJobDescriptionBuilder(
  batchJob: BatchJob,
  elapsedTime?: number
): string {
  let description = ""

  const entityName = batchJob.type.split("-").reverse().pop()

  const twentyfourHoursInMs = 24 * 60 * 60 * 1000

  switch (batchJob.status) {
    case "failed":
      description = `Export of ${entityName}s has failed.`
      break
    case "canceled":
      description = `Export of ${entityName}s has been canceled.`
      break
    case "completed":
      if (elapsedTime && Math.abs(elapsedTime) > twentyfourHoursInMs) {
        description = `Export file is no longer available. The file will only be stored for 24 hours.`
        break
      } else {
        description = `Export of ${entityName}s is done.`
        break
      }
    case "processing":
      description = `Export of ${entityName}s is being processed. You can safely close the activity tab. We will notify you once your export is ready for download.`
      break
    case "confirmed":
      description = `Export of ${entityName}s has been confirmed and will start soon.`
      break
    case "pre_processed":
      description = `Export of ${entityName}s is being prepared.`
      break
    default:
      description = `Export of ${entityName}s has been created and will start soon.`
  }

  return description
}
