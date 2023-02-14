import { Order, ShippingOption } from "@medusajs/medusa"
import { fireEvent, renderHook, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup"
import { useForm, UseFormReturn } from "react-hook-form"
import ShippingForm from ".."
import { fixtures } from "../../../../../test/mocks/data"
import { renderWithProviders } from "../../../../../test/test-utils"
import { nestedForm } from "../../../../../utils/nested-form"
import { CreateClaimFormType } from "../../../details/claim/register-claim-menu"
import { getDefaultClaimValues } from "../../../details/utils/get-default-values"

const selectFirstOption = async (user: UserEvent) => {
  const combobox = screen.getByRole("combobox")

  await waitFor(() => {
    combobox.focus()
  })

  // Open dropdown
  await user.keyboard("{arrowdown}")

  // Go to first option and select
  await user.keyboard("{arrowdown}")
  await user.keyboard("{Enter}")
}

describe("ShippingForm return shipping", () => {
  let form: UseFormReturn<CreateClaimFormType, any>

  beforeEach(() => {
    const order = fixtures.get("order") as unknown as Order

    const { result } = renderHook(() =>
      useForm<CreateClaimFormType>({
        defaultValues: getDefaultClaimValues(order),
      })
    )

    form = result.current

    renderWithProviders(
      <div>
        <ShippingForm
          order={order}
          isClaim
          isReturn
          form={nestedForm(form, "return_shipping")}
        />
      </div>
    )
  })

  it("should render correctly when type is refund", async () => {
    expect(screen.getByText("Shipping for return items"))
    expect(screen.queryByText("Shipping for replacement items")).toBeNull()
  })

  it("should render options when dropdown is opened", async () => {
    const user = userEvent.setup()
    const combobox = screen.getByRole("combobox")

    await waitFor(() => {
      combobox.focus()
    })

    await user.keyboard("{arrowdown}")

    await waitFor(() => {
      expect(screen.getAllByText("Free Shipping")).toHaveLength(5)
    })
  })

  it("should select an option when clicked", async () => {
    const user = userEvent.setup()
    await selectFirstOption(user)

    await waitFor(() => {
      expect(screen.getAllByText("Free Shipping")).toHaveLength(1)
    })

    const { return_shipping } = form.getValues()

    expect(return_shipping.option?.label).toEqual("Free Shipping")
    expect(return_shipping.option?.value).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        taxRate: 0,
      })
    )
  })

  it("should render correctly when option is selected", async () => {
    const shippingOption = fixtures.get(
      "shipping_option"
    ) as unknown as ShippingOption

    await waitFor(() => {
      form.setValue("return_shipping.option", {
        label: shippingOption.name,
        value: {
          id: shippingOption.id,
          taxRate: 0.12,
        },
      })
    })

    await waitFor(() => {
      expect(screen.getByText(shippingOption.name)).toBeInTheDocument()
    })
  })
})

describe("ShippingForm return shipping", () => {
  let form: UseFormReturn<CreateClaimFormType, any>

  beforeEach(() => {
    const order = fixtures.get("order") as unknown as Order

    const { result } = renderHook(() =>
      useForm<CreateClaimFormType>({
        defaultValues: {
          ...getDefaultClaimValues(order),
          claim_type: {
            type: "replace",
          },
        },
      })
    )

    form = result.current

    renderWithProviders(
      <div>
        <ShippingForm
          order={order}
          isClaim
          form={nestedForm(form, "replacement_shipping")}
        />
      </div>
    )
  })

  it("should render correctly when type is replace", async () => {
    expect(screen.getByText("Shipping for replacement items"))
    expect(screen.queryByText("Shipping for return items")).toBeNull()
  })

  it("should not display override button when no option is selected", async () => {
    expect(screen.queryByText("Add custom price")).toBeNull()
  })

  it("should display button to override shipping price when an option is selected", async () => {
    const user = userEvent.setup()
    await selectFirstOption(user)

    expect(screen.getByText("Add custom price")).toBeInTheDocument()
  })

  it("should display input to override shipping price when button is clicked", async () => {
    const user = userEvent.setup()
    await selectFirstOption(user)

    const button = screen.getByText("Add custom price")

    await user.click(button)

    expect(screen.queryByPlaceholderText("-")).toBeInTheDocument()
  })

  it("should update the shipping price when input is changed", async () => {
    const user = userEvent.setup()
    await selectFirstOption(user)

    const button = screen.getByText("Add custom price")

    await user.click(button)

    const input = screen.getByPlaceholderText("-")

    fireEvent.change(input, { target: { value: 5 } })

    expect(form.getValues().replacement_shipping.price).toEqual(500)
  })

  it("should remove the input when the clear button is clicked", async () => {
    const user = userEvent.setup()

    await selectFirstOption(user)

    const button = screen.getByText("Add custom price")

    await user.click(button)

    const clearButton = screen.queryByRole("button")

    if (clearButton) {
      await user.click(clearButton)
    }

    await waitFor(() => {
      expect(screen.queryByPlaceholderText("-")).toBeNull()
    })
  })
})
