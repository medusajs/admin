import { navigate } from "gatsby"
import { useAdminCreateDiscount, useAdminUpdateDiscount } from "medusa-react"
import { useDiscountForm } from "./discount-form-context"
import {
  DiscountFormValues,
  formValuesToCreateDiscountMapper,
  formValuesToUpdateDiscountMapper,
} from "./mappers"

export const useFormActions = (id: string, data: any) => {
  const updateDiscount = useAdminUpdateDiscount(id)
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

  const onUpdate = async (values: DiscountFormValues) => {
    const { discount } = data

    const ruleId = discount?.rule?.id

    await updateDiscount.mutateAsync({
      ...formValuesToUpdateDiscountMapper(ruleId, values, conditions),
    })
  }

  return {
    onSaveAsInactive,
    onSaveAsActive,
    onUpdate,
  }
}
