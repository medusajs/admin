import { Order } from "@medusajs/medusa"
import { renderHook, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useForm, UseFormReturn } from "react-hook-form"
import ItemsToReturnForm from ".."
import { fixtures } from "../../../../../test/mocks/data"
import { renderWithProviders } from "../../../../../test/test-utils"
import { nestedForm } from "../../../../../utils/nested-form"
import { CreateClaimFormType } from "../../../details/claim/register-claim-menu"
import { getDefaultClaimValues } from "../../../details/utils/get-default-values"

const order = fixtures.get("order") as unknown as Order

describe("ItemsToSendForm with RegisterClaimMenu", () => {
  let form: UseFormReturn<CreateClaimFormType, any>

  beforeEach(() => {
    const { result } = renderHook(() =>
      useForm<CreateClaimFormType>({
        defaultValues: getDefaultClaimValues(order),
      })
    )

    form = result.current

    renderWithProviders(
      <ItemsToReturnForm
        form={nestedForm(form, "return_items")}
        order={order}
      />
    )
  })

  it("should render correctly", async () => {
    expect(screen.getByText("test product")).toBeInTheDocument()
    expect(screen.getByText("test variant")).toBeInTheDocument()
  })

  it("should initially not be marked as an item to be returned", async () => {
    const checkboxes = screen.getAllByRole("checkbox")
    const checkbox = checkboxes[0]

    expect(checkbox).not.toBeChecked()
  })

  it("should mark item as to be returned when checkbox is checked", async () => {
    const checkboxes = screen.getAllByRole("checkbox")
    const checkbox = checkboxes[0]

    const user = userEvent.setup()

    await user.click(checkbox)

    expect(checkbox).toBeChecked()

    const { return_items } = form.getValues()

    expect(return_items.items[0].return).toEqual(true)
  })

  it("should update quantity correctly", async () => {
    const checkboxes = screen.getAllByRole("checkbox")
    const checkbox = checkboxes[0]

    const user = userEvent.setup()

    await user.click(checkbox)

    expect(checkbox).toBeChecked()

    const decrement = screen.getByLabelText("Decrease quantity")

    await user.click(decrement)

    const { return_items } = form.getValues()

    expect(return_items.items[0].quantity).toEqual(4)

    const increment = screen.getByLabelText("Increase quantity")

    await user.click(increment)

    expect(return_items.items[0].quantity).toEqual(5)
  })
})
