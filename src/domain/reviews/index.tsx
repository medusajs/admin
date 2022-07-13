import React from "react"
import { Router } from "@reach/router"
import ProductReviews from "./products"
import CancellationFeedbacks from "./cancellations"

const Reviews = () => {
  return (
    <Router>
      <ProductReviews path="/" />
      <CancellationFeedbacks path="/cancellations"></CancellationFeedbacks>
    </Router>
  )
}

export default Reviews
