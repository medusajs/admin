import { navigate } from "gatsby"
import {
  useAdminCreateDiscount,
  useAdminDiscountRemoveCondition,
  useAdminUpdateDiscount,
} from "medusa-react"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { CondtionMapItem } from "../../types"
import { useDiscountForm } from "./discount-form-context"
import {
  DiscountFormValues,
  formValuesToCreateDiscountMapper,
  formValuesToUpdateDiscountMapper,
} from "./mappers"

export const useFormActions = (id: string, data: any) => {
  const updateDiscount = useAdminUpdateDiscount(id)
  const createDiscount = useAdminCreateDiscount()
  const removeCondition = useAdminDiscountRemoveCondition(id)

  const notification = useNotification()

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

  const onRemoveConditions = async (conditions: CondtionMapItem[]) => {
    await Promise.all(
      conditions.map((condition) => {
        if (condition.id) {
          removeCondition.mutateAsync(condition.id, {
            onError: (error) => {
              notification("Error", getErrorMessage(error), "error")
            },
          })
        }
      })
    )
  }

  return {
    onSaveAsInactive,
    onSaveAsActive,
    onUpdate,
    onRemoveConditions,
  }
}
