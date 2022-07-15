import React from "react"
import { navigate } from "gatsby"

import TableViewHeader from "../../components/organisms/custom-table-header"

type HeaderProps = {
  activeView: "products" | "cancellations"
}

const ReviewsHeader: React.FC<HeaderProps> = (props: HeaderProps) => {
  return (
    <TableViewHeader
      setActiveView={(v) => {
        if (v === "products") {
          return navigate(`/a/reviews`)
        }
        navigate(`/a/reviews/cancellations`)
      }}
      views={["products", "cancellations"]}
      activeView={props.activeView}
    />
  )
}

export default ReviewsHeader
