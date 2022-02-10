import { RouteComponentProps } from "@reach/router"
import { navigate } from "gatsby"
import {
  useAdminDeleteDiscount,
  useAdminDiscount,
  useAdminProducts,
  useAdminRegions,
  useAdminUpdateDiscount,
} from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import Spinner from "../../../components/atoms/spinner"
import Button from "../../../components/fundamentals/button"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import DiscountGeneral from "../../../components/templates/discount-general"
import DiscountSettings from "../../../components/templates/discount-settings"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import {
  extractProductOptions,
  extractRegionOptions,
} from "../../../utils/extract-options"
import { hydrateDiscount } from "../../../utils/hydrate-discount"
import { DiscountFormType } from "../types"

type EditProps = {
  id: string
} & RouteComponentProps

const Edit: React.FC<EditProps> = ({ id }) => {
  const { regions } = useAdminRegions()
  const { products } = useAdminProducts()
  const { discount, isLoading } = useAdminDiscount(id)
  const updateDiscount = useAdminUpdateDiscount(id)
  const deleteDiscount = useAdminDeleteDiscount(id)
  const notification = useNotification()

  // General state
  const [regionsDisabled, setRegionsDisabled] = useState(false)
  const [isDynamic, setIsDynamic] = useState(discount?.is_dynamic ?? false)
  const [isDisabled, setIsDisabled] = useState(discount?.is_disabled ?? false)
  const [discountType, setDiscountType] = useState<string>(
    discount?.rule?.type || "percentage"
  )
  const [selectedRegions, setSelectedRegions] = useState<
    { label: string; value: string }[]
  >([])
  const regionOptions: { label: string; value: string }[] = useMemo(() => {
    return extractRegionOptions(regions)
  }, [regions])

  // Settings state
  const [isFreeShipping, setIsFreeShipping] = useState(
    discount?.rule?.type === "free_shipping"
  )
  const [allocationItem, setAllocationItem] = useState<boolean | undefined>(
    discount?.rule?.allocation === "item"
  )
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    discount?.ends_at
  )
  const [hasExpiryDate, setHasExpiryDate] = useState(
    discount?.ends_at ? true : false
  )
  const [startDate, setStartDate] = useState(new Date())
  const [availabilityDuration, setAvailabilityDuration] = useState<
    string | undefined
  >(discount?.valid_duration)
  const [appliesToAll, setAppliesToAll] = useState(
    !discount?.rule?.valid_for?.length
  )

  const [showDelete, setShowDelete] = useState(false)

  const [selectedProducts, setSelectedProducts] = useState<
    { label: string; value: string }[]
  >([])
  const productOptions: { label: string; value: string }[] = useMemo(() => {
    return extractProductOptions(products)
  }, [products])

  useEffect(() => {
    if (discountType === "fixed" && selectedRegions.length > 1) {
      setDiscountType("percentage")
    }
  }, [selectedRegions, discountType])

  const methods = useForm<DiscountFormType>()

  useEffect(() => {
    hydrateDiscount({
      discount,
      actions: {
        setRegionsDisabled,
        setIsDynamic,
        setIsDisabled,
        setDiscountType,
        setSelectedRegions,
        setIsFreeShipping,
        setAllocationItem,
        setExpiryDate,
        setHasExpiryDate,
        setStartDate,
        setAvailabilityDuration,
        setAppliesToAll,
        setSelectedProducts,
        setValue: methods.setValue,
      },
      isEdit: true,
    })
  }, [discount])

  const handleDelete = () => {
    if (!discount) {
      notification("Error", "Discount not found", "error")
    }

    deleteDiscount.mutate(undefined, {
      onSuccess: () => {
        navigate("/a/discounts")
      },
    })
  }

  const handleDuplicate = () => {
    if (!discount) {
      notification("Error", "Discount not found", "error")
    }

    navigate(`/a/discounts/new`, {
      state: {
        discount: discount,
      },
    })
  }

  const handleStatusUpdate = () => {
    if (!discount) {
      return
    }

    updateDiscount.mutate(
      { is_disabled: !isDisabled },
      {
        onSuccess: () => {
          notification("Success", "Discount updated", "success")
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  }

  const submit = (data: DiscountFormType) => {
    if (!discount) {
      return
    }

    const payload = {
      ...data,
      rule: {
        ...data.rule,
        id: discount.rule.id,
        value: discount.rule.value,
        type: isFreeShipping ? "free_shipping" : discountType,
        allocation: allocationItem ? "item" : "total",
        valid_for: appliesToAll ? [] : selectedProducts.map((p) => p.value),
      },
      usage_limit: parseFloat(data.usage_limit),
      starts_at: startDate,
      ends_at: hasExpiryDate ? expiryDate : null,
      regions: selectedRegions.map(({ value }) => value),
      valid_duration: availabilityDuration,
      is_dynamic: isDynamic,
    }

    updateDiscount.mutate(
      { ...payload }, // TODO: fix wrong type on rule.value and rule.valid_for
      {
        onSuccess: () => {
          notification("Success", "Successfully updated discount", "success")
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  }

  if (isLoading || !discount) {
    return (
      <div className="flex items-center justify-center">
        <Spinner size="large" variant="secondary" />
      </div>
    )
  }

  return (
    <div className="pb-xlarge">
      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(!showDelete)}
          onDelete={async () => handleDelete()}
          successText="Discount deleted"
          confirmText="Yes, delete"
          text="Are you sure you want to delete this discount?"
          heading="Delete discount"
        />
      )}
      <Breadcrumb
        currentPage="Edit Discount"
        previousBreadcrumb="Discount"
        previousRoute="/a/discounts"
      />
      <FormProvider {...methods}>
        {/* disable accidental submissions */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-y-large">
            <DiscountGeneral
              isEdit={true}
              isDisabled={isDisabled}
              subtitle="Create a discount code for all or some of your products"
              regionOptions={regionOptions}
              selectedRegions={selectedRegions}
              setSelectedRegions={setSelectedRegions}
              discountType={discountType}
              setDiscountType={setDiscountType}
              isFreeShipping={isFreeShipping}
              isDynamic={isDynamic}
              setIsDynamic={setIsDynamic}
              regionIsDisabled={regionsDisabled}
              onDelete={() => setShowDelete(!showDelete)}
              onDuplicate={handleDuplicate}
              onStatusChange={handleStatusUpdate}
            />
            <DiscountSettings
              appliesToAll={appliesToAll}
              setAppliesToAll={setAppliesToAll}
              productOptions={productOptions}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
              hasExpiryDate={hasExpiryDate}
              setHasExpiryDate={setHasExpiryDate}
              startDate={startDate}
              setStartDate={setStartDate}
              setAvailabilityDuration={setAvailabilityDuration}
              availabilityDuration={availabilityDuration}
              isFreeShipping={isFreeShipping}
              setIsFreeShipping={setIsFreeShipping}
              allocationItem={allocationItem}
              setAllocationItem={setAllocationItem}
              isDynamic={isDynamic}
              isEdit={true}
            />
            <div className="w-full flex items-center justify-end gap-x-xsmall">
              <Button
                variant="secondary"
                size="medium"
                type="button"
                onClick={() => navigate("/a/discounts")}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="medium"
                onClick={methods.handleSubmit(submit)}
              >
                Save changes
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default Edit
