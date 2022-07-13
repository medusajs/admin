import moment from "moment"
import React from "react"
import Table, { TablePagination } from "../../molecules/table"

type CancellationFeedbackTableProps = {
  cancellations: any[]
  pageNumber: number
  pageSize: number
  totalResults: number
  filter?: { product_variant_id?: number | number[] }
  sort?: { column?: string; direction?: "asc" | "desc" }
  setPageNumber: (number: number) => void
}

const CancellationFeedbackTable: React.FC<CancellationFeedbackTableProps> = ({
  cancellations,
  pageNumber,
  pageSize,
  totalResults,
  setPageNumber,
}) => {
  const getRow = (cancellation, index) => {
    return (
      <Table.Row key={`cancellation-feedback-${index}`} color={"inherit"}>
        <Table.Cell className="w-[100px] truncate">
          {moment(cancellation.created_at).format("MMM Do YYYY")}
        </Table.Cell>
        <Table.Cell className="w-[100px]">
          {cancellation.customer.name}
        </Table.Cell>
        <Table.Cell>{cancellation.reason}</Table.Cell>
        <Table.Cell className="w-[50px]">{cancellation.rating}</Table.Cell>
        <Table.Cell>{cancellation.final_notes}</Table.Cell>
      </Table.Row>
    )
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <Table>
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Customer</Table.HeadCell>
            <Table.HeadCell>Reason</Table.HeadCell>
            <Table.HeadCell>Rating</Table.HeadCell>
            <Table.HeadCell>Final Notes</Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body className="text-grey-90">
          {cancellations?.map((r, idx) => getRow(r, idx))}
        </Table.Body>
      </Table>
      <TablePagination
        count={totalResults}
        limit={pageSize}
        offset={(pageNumber - 1) * pageSize}
        pageSize={cancellations.length}
        title="Cancellations"
        currentPage={pageNumber}
        pageCount={totalResults / pageSize}
        nextPage={() => setPageNumber(pageNumber + 1)}
        prevPage={() => setPageNumber(pageNumber - 1)}
        hasNext={totalResults > pageNumber * pageSize}
        hasPrev={pageNumber > 1}
      />
    </div>
  )
}

export default CancellationFeedbackTable
