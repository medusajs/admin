import { navigate } from "gatsby"
import { useAdminCreateDiscount, useAdminUpdateDiscount } from "medusa-react"
import {
  DiscountFormValues,
  formValuesToCreateDiscountMapper,
  formValuesToUpdateDiscountMapper,
} from "./mappers"

export const useFormActions = (id: string, data: any) => {
  const updateDiscount = useAdminUpdateDiscount(id)
  const createDiscount = useAdminCreateDiscount()

  const onSaveAsInactive = async (values: DiscountFormValues) => {
    await createDiscount.mutateAsync(
      {
        ...formValuesToCreateDiscountMapper(values),
        ...data,
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
        ...formValuesToCreateDiscountMapper(values),
        ...data,
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
    await updateDiscount.mutateAsync({
      ...formValuesToUpdateDiscountMapper({
        id,
        ...data,
        ...values,
      }),
    })
  }

  return {
    onSaveAsInactive,
    onSaveAsActive,
    onUpdate,
  }
}
