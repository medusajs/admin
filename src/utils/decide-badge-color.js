export function decideBadgeColor(batchLabel) {
  switch (batchLabel) {
    case "captured":
    case "completed":
    case "requires_action":
      return {
        bgColor: "#ff4133",
        color: "white",
      }
    case "shipped":
      return {
        bgColor: "#4BB543",
        color: "white",
      }
    case "partially_refunded":
    case "refunded":
    case "fulfilled":
    case "partially_fulfilled":
    case "partially_shipped":
    case "returned":
      return {
        bgColor: "#ffd733",
        color: "black",
      }
    case "cancelled":
    case "failed":
      return {
        bgColor: "#ff4133",
        color: "white",
      }
    default:
      return {
        bgColor: "#e3e8ee",
        color: "#4f566b",
      }
  }
}
