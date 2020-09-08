export function decideBadgeColor(batchLabel) {
  switch (batchLabel) {
    case "captured" || "completed" || "shipped":
      return {
        bgColor: "#4BB543",
        color: "white",
      }
    case "partially_refunded" ||
      "refunded" ||
      "fulfilled" ||
      "partially_fulfilled" ||
      "partially_shipped" ||
      "returned":
      return {
        bgColor: "yellow",
        color: "black",
      }
    case "cancelled" || "failed":
      return {
        bgColor: "yellow",
        color: "black",
      }
    default:
      return {
        bgColor: "#e3e8ee",
        color: "#4f566b",
      }
  }
}
