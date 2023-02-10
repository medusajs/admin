import { Order, ShippingOption } from "@medusajs/medusa"
import { useForm } from "react-hook-form"
import { fixtures } from "../../../../../test/mocks/data"
import { render, renderHook, screen } from "../../../../../test/test-utils"
import { CreateClaimFormType } from "../../../details/claim/register-claim-menu"
import { ClaimSummary } from "../claim-summary"

describe("ClaimSummary", () => {
  let order: Order
  let so: ShippingOption

  beforeEach(() => {
    order = fixtures.get("order") as unknown as Order
    so = fixtures.get("shipping_option") as unknown as ShippingOption
  })

  it("should render correctly when the balance is negative", async () => {
    const { result } = renderHook(() =>
      useForm<CreateClaimFormType>({
        defaultValues: {
          return_items: {
            items: fixtures.get("order").items.map((item) => ({
              item_id: item.id,
              quantity: item.quantity,
              return: true,
              refundable: 90000,
              total: 12,
              original_quantity: item.quantity,
            })),
          },
          additional_items: {
            items: fixtures.list("line_item", 5).map((item) => ({
              item_id: item.id,
              quantity: item.quantity,
              price: 10000,
            })),
          },
          replacement_shipping: {
            price: 100,
            option: {
              label: so.name,
              value: so.id,
            },
          },
          return_shipping: {
            price: 0,
            option: {
              label: so.name,
              value: so.id,
            },
          },
          claim_type: {
            type: "replace",
          },
        },
      })
    )

    render(<ClaimSummary order={order} form={result.current} />)

    // Should display a warning tooltip
    expect(
      screen.getByTestId("negative-difference-tooltip")
    ).toBeInTheDocument()

    // Should display a negative difference
    expect(screen.getByText("-$500.88").className).toContain("text-rose-50")

    // Should display a refund of $0.00
    expect(screen.getByText("$0.00")).toBeInTheDocument()
  })

  it("should render correctly if the difference is positive or 0", async () => {
    const { result } = renderHook(() =>
      useForm<CreateClaimFormType>({
        defaultValues: {
          return_items: {
            items: fixtures.get("order").items.map((item) => ({
              item_id: item.id,
              quantity: item.quantity,
              return: true,
              refundable: 90000,
              total: 90000,
              original_quantity: item.quantity,
            })),
          },
          additional_items: {
            items: fixtures.list("line_item", 5).map((item) => ({
              item_id: item.id,
              quantity: item.quantity,
              price: 10000,
            })),
          },
          replacement_shipping: {
            price: 100,
            option: {
              label: so.name,
              value: so.id,
            },
          },
          return_shipping: {
            price: 0,
            option: {
              label: so.name,
              value: so.id,
            },
          },
          claim_type: {
            type: "replace",
          },
        },
      })
    )

    render(<ClaimSummary order={order} form={result.current} />)

    // Should not display a warning tooltip
    expect(
      screen.queryByTestId("negative-difference-tooltip")
    ).not.toBeInTheDocument()

    // Should display a positive difference and use the same value for refund
    expect(screen.getAllByText("$399.00")).toHaveLength(2)
  })

  it("should render both a return and replacement shipping option", async () => {
    const { result } = renderHook(() =>
      useForm<CreateClaimFormType>({
        defaultValues: {
          return_items: {
            items: fixtures.get("order").items.map((item) => ({
              item_id: item.id,
              quantity: item.quantity,
              return: true,
              refundable: 90000,
              total: 90000,
              original_quantity: item.quantity,
            })),
          },
          additional_items: {
            items: fixtures.list("line_item", 5).map((item) => ({
              item_id: item.id,
              quantity: item.quantity,
              price: 10000,
            })),
          },
          replacement_shipping: {
            price: 1750,
            option: {
              label: so.name,
              value: so.id,
            },
          },
          return_shipping: {
            price: 0,
            option: {
              label: so.name,
              value: so.id,
            },
          },
          claim_type: {
            type: "replace",
          },
        },
      })
    )

    render(<ClaimSummary order={order} form={result.current} />)

    expect(screen.getAllByText(so.name)).toHaveLength(2)

    expect(screen.getByText("Return shipping")).toBeInTheDocument()
    expect(screen.getByText("Free")).toBeInTheDocument()

    expect(screen.getByText("Replacement shipping")).toBeInTheDocument()
    expect(screen.getByText("$17.50")).toBeInTheDocument()
  })
})
