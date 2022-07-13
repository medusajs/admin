import moment from "moment"
import React from "react"
import { ProductReview } from "../../../services/nibll-api"
import Table, { TablePagination } from "../../molecules/table"

type ProductReviewsTableProps = {
  reviews: ProductReview[]
  pageNumber: number
  pageSize: number
  totalResults: number
  filter?: { product_variant_id?: number | number[] }
  sort?: { column?: string; direction?: "asc" | "desc" }
  setPageNumber: (number: number) => void
}

const ProductReviewRow: React.FC<{ review: ProductReview; index: number }> = ({
  review,
  index,
}) => (
  <Table.Row key={`product-review-${index}`} color={"inherit"}>
    <Table.Cell className="w-[100px] truncate">
      {moment(review.created_at).format("MMM Do YYYY")}
    </Table.Cell>
    <Table.Cell className="w-[100px] truncate">
      {review.customer.name}
    </Table.Cell>
    <Table.Cell>
      <div className="flex items-center space-x-2">
        <img
          src={review.line_item.thumbnail}
          alt="Thumbnail"
          className="h-full object-cover w-[50px]"
        />
        <p>{review.line_item.title}</p>
      </div>
    </Table.Cell>
    <Table.Cell className="w-[70px]">{review.rating}</Table.Cell>
    <Table.Cell className="space-x-2">{review.note}</Table.Cell>
  </Table.Row>
)

const ProductReviewsTable: React.FC<ProductReviewsTableProps> = ({
  reviews,
  pageNumber,
  pageSize,
  totalResults,
  setPageNumber,
}) => {
  return (
    <div className="w-full h-full overflow-y-auto">
      <Table>
        <Table.Head>
          <Table.HeadRow>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Customer</Table.HeadCell>
            <Table.HeadCell>Item</Table.HeadCell>
            <Table.HeadCell>Rating</Table.HeadCell>
            <Table.HeadCell>Note</Table.HeadCell>
          </Table.HeadRow>
        </Table.Head>
        <Table.Body className="text-grey-90">
          {reviews.map((r, idx) => (
            <ProductReviewRow review={r} index={idx} key={r.id} />
          ))}
          {reviews?.length < 1 && "There are no reviews yet."}
        </Table.Body>
      </Table>
      <TablePagination
        count={totalResults}
        limit={pageSize}
        offset={(pageNumber - 1) * pageSize}
        pageSize={reviews.length}
        title="Reviews"
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

export default ProductReviewsTable
