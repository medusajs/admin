import { Discount, DiscountCondition } from "@medusajs/medusa"
import {
  useAdminAddDiscountConditionResourceBatch,
  useAdminDeleteDiscountConditionResourceBatch,
  useAdminUpdateDiscount,
} from "medusa-react"
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"
import {
  ConditionMap,
  DiscountConditionOperator,
  DiscountConditionType,
  UpdateConditionProps,
} from "../../../types"

type ConditionsProviderProps = {
  condition: DiscountCondition
  discount: Discount
  children: ReactNode
}

type EditConditionContextType = {
  condition: DiscountCondition
  discount: Discount
  isLoading: boolean
  addConditionResources: (resources: string[]) => void
  removeConditionResources: (resources: string[]) => void
}

const EditConditionContext = createContext<EditConditionContextType | null>(
  null
)

export const EditConditionProvider = ({
  condition,
  discount,
  children,
}: ConditionsProviderProps) => {
  const notification = useNotification()

  const addConditionResourceBatch = useAdminAddDiscountConditionResourceBatch(
    discount.id,
    condition.id
  )

  const removeConditionResourceBatch = useAdminDeleteDiscountConditionResourceBatch(
    discount.id,
    condition.id
  )

  const addConditionResources = (resourcesToAdd: string[]) => {
    addConditionResourceBatch.mutate(
      { resources: resourcesToAdd.map((r) => ({ id: r })) },
      {
        onSuccess: () => {
          notification(
            "Success",
            "The resources were successfully added",
            "success"
          )
          // onClose()
        },
        onError: () =>
          notification("Error", "Failed to add resources", "error"),
      }
    )
  }

  const removeConditionResources = (resourcesToRemove: string[]) => {
    removeConditionResourceBatch.mutate(
      { resources: resourcesToRemove.map((r) => ({ id: r })) },
      {
        onSuccess: () => {
          notification(
            "Success",
            "The resources were successfully removed",
            "success"
          )
          // onClose()
        },
        onError: () =>
          notification("Error", "Failed to remove resources", "error"),
      }
    )
  }

  return (
    <EditConditionContext.Provider
      value={{
        condition,
        discount,
        addConditionResources,
        removeConditionResources,
        isLoading:
          addConditionResourceBatch.isLoading ||
          removeConditionResourceBatch.isLoading,
      }}
    >
      {children}
    </EditConditionContext.Provider>
  )
}

export const useEditConditionContext = () => {
  const context = useContext(EditConditionContext)
  if (context === null) {
    throw new Error(
      "useEditConditionContext must be used within a EditConditionProvider"
    )
  }
  return context
}
