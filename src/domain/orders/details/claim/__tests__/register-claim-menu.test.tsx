import { Order } from "@medusajs/medusa"
import userEvent from "@testing-library/user-event"
import { useAdminShippingOptions } from "medusa-react"
import { fixtures } from "../../../../../test/mocks/data"
import { render, screen, waitFor } from "../../../../../utils/test-utils"
import RegisterClaimMenu from "../register-claim-menu"

describe("RegisterClaimMenu", () => {
  let order: Order

  beforeEach(() => {
    order = fixtures.get("order") as unknown as Order
    render(<RegisterClaimMenu order={order} onClose={() => {}} />)
  })

  it("should render one returnable item", async () => {
    await waitFor(() => {
      expect(screen.getByTestId("return_item_checkbox_0")).toBeInTheDocument()
      expect(screen.getByTestId("return_item_refundable_0").textContent).toBe(
        "$72.00"
      )
      expect(useAdminShippingOptions).toHaveReturnedWith({
        shipping_options: fixtures.list("shipping_option", 5),
        isLoading: false,
        count: 5,
      })
      expect(screen.getByLabelText("Shipping method")).toBeInTheDocument()
    })
  })

  it("should submit a refund claim", async () => {
    const user = userEvent.setup()

    await user.click(screen.getByTestId("return_item_checkbox_0"))

    await waitFor(() => {})
  })
})
