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
      description = `The export of the ${entityName} list has failed.`
      break;
    case "canceled":
      description = `The export of the ${entityName} list has been canceled.`
      break;
    case "completed":
      if (elapsedTime && Math.abs(elapsedTime) > twentyfourHoursInMs) {
        description =`This export file is no longer available. The file will only be stored for 24 hours.`
        break;
      } else {
        description = `The preparing export of your ${entityName} list is done and ready to go.`
        break;
      }
    case "processing":
      description = `The export of the ${entityName} list is being processed. You can safely close the activity tab. We will notify you once your export is ready for download.`
      break;
    case "confirmed":
      description = `The export of the ${entityName} list has been confirmed and will start soon.`
      break;
    case "pre_processed":
      description = `The export of the ${entityName} list is being prepared.`
      break;
    default:
      description = `The export of the ${entityName} list as been created and will start soon.`
  }

  return description
}