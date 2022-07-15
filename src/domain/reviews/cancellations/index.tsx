import { RouteComponentProps } from "@reach/router"
import { navigate } from "gatsby"
import { parse } from "query-string"
import React from "react"
import BodyCard from "../../../components/organisms/body-card"
import CancellationFeedbackTable from "../../../components/templates/cancellation-feedback-table"
import { useCancellationFeedbackQuery } from "../../../services/nibll-api"
import ReviewsHeader from "../header"

const CancellationFeedbacks: React.FC<RouteComponentProps> = ({ location }) => {
  const queryParams = parse(location?.search as string)
  const pageNumber = parseInt(queryParams.pageNumber as string, 10) || 1
  const pageSize = 20
  const { isLoading, data } = useCancellationFeedbackQuery({
    pageNumber,
    pageSize,
  })

  const updateQueryParams = (overwrite: object) => {
    const params = new URLSearchParams({
      pageNumber,
      pageSize,
      ...overwrite,
    } as any)

    navigate(`/a/reviews/cancellations?${params.toString()}`)
  }

  return (
    <div className="w-full flex flex-col grow">
      <BodyCard customHeader={<ReviewsHeader activeView="cancellations" />}>
        {!isLoading && data && (
          <CancellationFeedbackTable
            cancellations={data.data}
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalResults={data.totalResults}
            setPageNumber={(pageNumber) => updateQueryParams({ pageNumber })}
          />
        )}
      </BodyCard>
    </div>
  )
}

export default CancellationFeedbacks
