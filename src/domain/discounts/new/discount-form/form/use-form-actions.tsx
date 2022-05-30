import { navigate } from "gatsby"
import { useAdminCreateDiscount } from "medusa-react"
import { useDiscountForm } from "./discount-form-context"
import { DiscountFormValues, formValuesToCreateDiscountMapper } from "./mappers"

export const useFormActions = () => {
  const createDiscount = useAdminCreateDiscount()

  const { conditions } = useDiscountForm()

  const onSaveAsInactive = async (values: DiscountFormValues) => {
    await createDiscount.mutateAsync(
      {
        ...formValuesToCreateDiscountMapper(values, conditions),
        is_disabled: true,
      },
      {
        onSuccess: () => {
          navigate("/a/discounts")
        },
      }
    )
  }

  const onSaveAsActive = async (values: DiscountFormValues) => {
    await createDiscount.mutateAsync(
      {
        ...formValuesToCreateDiscountMapper(values, conditions),
        is_disabled: false,
      },
      {
        onSuccess: () => {
          navigate("/a/discounts")
        },
      }
    )
  }

  return {
    onSaveAsInactive,
    onSaveAsActive,
  }
}
