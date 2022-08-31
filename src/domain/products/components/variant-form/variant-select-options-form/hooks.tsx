import { isEqual } from "lodash"
import { useMemo } from "react"
import { useWatch } from "react-hook-form"
import { VariantOptionValueType } from "."
import { NestedForm } from "../../../../../utils/nested-form"
import { AddVariantsFormType } from "../../../new/add-variants"

const useCheckOptions = (variantForm: NestedForm<AddVariantsFormType>) => {
  const { control: variantControl, path: variantPath } = variantForm

  const watchedEntries = useWatch({
    control: variantControl,
    name: variantPath("entries"),
  })

  const existingCombinations = useMemo(() => {
    const arr: { id: string | undefined; options: VariantOptionValueType[] }[] =
      watchedEntries?.map((we) => ({
        id: we._internal_id,
        options: we.options,
      })) || []

    return arr
  }, [watchedEntries])

  const checkForDuplicate = ({
    id,
    options,
  }: {
    id: string
    options: VariantOptionValueType[]
  }) => {
    if (!existingCombinations.length) {
      return false
    }

    const existingCombinationsToCheck = existingCombinations.filter(
      (ec) => ec.id !== id
    )

    return existingCombinationsToCheck.some((existingCombination) => {
      return isEqual(
        existingCombination.options.map((o) => o.value),
        options.map((o) => o.value)
      )
    })
  }

  return { checkForDuplicate }
}

export default useCheckOptions
