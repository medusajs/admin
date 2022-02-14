import { RouteComponentProps } from "@reach/router"
import { navigate, PageProps } from "gatsby"
import {
  useAdminCreateDiscount,
  useAdminProducts,
  useAdminRegions,
} from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import DiscountGeneral from "../../../components/templates/discount-general"
import DiscountSettings from "../../../components/templates/discount-settings"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import {
  extractProductOptions,
  extractRegionOptions,
} from "../../../utils/extract-options"
import { hydrateDiscount } from "../../../utils/hydrate-discount"
import { getNativeSymbol, persistedPrice } from "../../../utils/prices"
import { DiscountFormType } from "../types"

type NewProps = RouteComponentProps & PageProps

const New: React.FC<NewProps> = ({ location }) => {
  const { regions } = useAdminRegions()
  const { products } = useAdminProducts()
  const discounts = useAdminCreateDiscount()
  const notification = useNotification()

  const toDuplicate = location.state?.discount

  // General state
  const [isDynamic, setIsDynamic] = useState(false)
  const [discountType, setDiscountType] = useState<string>("percentage")
  const [selectedRegions, setSelectedRegions] = useState<
    { label: string; value: string }[]
  >([])
  const regionOptions: {
    label: string
    value: string
    currency: string
  }[] = useMemo(() => {
    return extractRegionOptions(regions)
  }, [regions])
  const [nativeSymbol, setNativeSymbol] = useState<string | undefined>(
    undefined
  )

  // Settings state
  const [isFreeShipping, setIsFreeShipping] = useState(false)
  const [allocationItem, setAllocationItem] = useState<boolean | undefined>(
    false
  )
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined)
  const [hasExpiryDate, setHasExpiryDate] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [availabilityDuration, setAvailabilityDuration] = useState<
    string | undefined
  >(undefined)
  const [appliesToAll, setAppliesToAll] = useState(true)
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

  useEffect(() => {
    if (selectedRegions.length) {
      const selectedRegion = regionOptions.find(
        (r) => r.value === selectedRegions[0].value
      )

      if (selectedRegion) {
        setNativeSymbol(getNativeSymbol(selectedRegion.currency))
      }
    }

    if (!selectedRegions.length) {
      setNativeSymbol(undefined)
    }
  }, [selectedRegions])

  const methods = useForm()

  const getPersistedPrice = (price: number) => {
    if (!selectedRegions.length || !regions) {
      return
    }
    const region = regions.find((r) => r.id === selectedRegions[0].value)
    if (!region) {
      return
    }
    return persistedPrice(region.currency_code, price)
  }

  const buildPayload = (data: DiscountFormType, isDraft: boolean) => {
    return {
      ...data,
      rule: {
        ...data.rule,
        value: isFreeShipping
          ? 0
          : discountType === "fixed"
          ? getPersistedPrice(parseFloat(data.rule.value))
          : parseFloat(data.rule.value),
        type: discountType,
        allocation: allocationItem ? "item" : "total",
        valid_for: appliesToAll
          ? undefined
          : selectedProducts.map((p) => p.value),
      },
      usage_limit: parseFloat(data.usage_limit),
      starts_at: startDate,
      ends_at: expiryDate,
      regions: selectedRegions.map(({ value }) => value),
      valid_duration: !isDynamic ? undefined : availabilityDuration,
      is_disabled: isDraft,
      is_dynamic: isDynamic,
    }
  }

  const submitData = (payload, successMessage) => {
    discounts.mutate(
      { ...payload },
      {
        onSuccess: ({ discount }) => {
          notification("Success", successMessage, "success")
          navigate(`/a/discounts/${discount.id}`)
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  }

  const submitDraft = (data: DiscountFormType) => {
    const payload = buildPayload(data, true)
    submitData(payload, "Discount draft saved successfully")
  }

  const submitAndPublish = (data: DiscountFormType) => {
    const payload = buildPayload(data, false)
    submitData(payload, "Discount created successfully")
  }

  useEffect(() => {
    if (!toDuplicate) {
      return
    }

    hydrateDiscount({
      discount: toDuplicate,
      actions: {
        setValue: methods.setValue,
        setAllocationItem,
        setAppliesToAll,
        setAvailabilityDuration,
        setDiscountType,
        setExpiryDate,
        setHasExpiryDate,
        setIsDynamic,
        setIsFreeShipping,
        setSelectedProducts,
        setSelectedRegions,
        setStartDate,
      },
      isEdit: false,
    })
  }, [toDuplicate])

  return (
    <div className="pb-xlarge">
      <Breadcrumb
        currentPage="Add Discount"
        previousBreadcrumb="Discount"
        previousRoute="/a/discounts"
      />
      <FormProvider {...methods}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-y-large">
            <DiscountGeneral
              isEdit={false}
              isDisabled={false}
              subtitle="Create a discount code for all or some of your products"
              regionOptions={regionOptions}
              selectedRegions={selectedRegions}
              setSelectedRegions={setSelectedRegions}
              discountType={discountType}
              setDiscountType={setDiscountType}
              isFreeShipping={isFreeShipping}
              isDynamic={isDynamic}
              setIsDynamic={setIsDynamic}
              nativeSymbol={nativeSymbol}
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
                variant="secondary"
                size="medium"
                onClick={methods.handleSubmit(submitDraft)}
              >
                Save as draft
              </Button>
              <Button
                variant="primary"
                size="medium"
                onClick={methods.handleSubmit(submitAndPublish)}
              >
                Publish discount
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

export default New
