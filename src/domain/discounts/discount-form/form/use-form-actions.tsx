import { navigate } from "gatsby"
import { useAdminCreateDiscount, useAdminUpdateDiscount } from "medusa-react"
import {
  DiscountFormValues,
  formValuesToCreateDiscountMapper,
  formValuesToUpdateDiscountMapper,
} from "./mappers"

export const useFormActions = (id: string) => {
  const updateDiscount = useAdminUpdateDiscount(id)
  const createDiscount = useAdminCreateDiscount()

  const onSaveAsInactive = async (values: DiscountFormValues) => {
    createDiscount.mutate(
      {
        ...formValuesToCreateDiscountMapper(values),
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
    createDiscount.mutate(
      {
        ...formValuesToCreateDiscountMapper(values),
        is_disabled: false,
      },
      {
        onSuccess: () => {
          navigate("/a/discounts")
        },
      }
    )
  }

  const onUpdate = async (values: DiscountFormValues) => {
    updateDiscount.mutate({
      ...formValuesToUpdateDiscountMapper(values),
    })
  }

  return {
    onSaveAsInactive,
    onSaveAsActive,
    onUpdate,
  }
}
