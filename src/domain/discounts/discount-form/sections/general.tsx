import clsx from "clsx"
import { navigate } from "gatsby"
import {
  useAdminDeleteDiscount,
  useAdminRegions,
  useAdminUpdateDiscount,
} from "medusa-react"
import React, { useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import Checkbox from "../../../../components/atoms/checkbox"
import DuplicateIcon from "../../../../components/fundamentals/icons/duplicate-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { ActionType } from "../../../../components/molecules/actionables"
import InfoTooltip from "../../../../components/molecules/info-tooltip"
import InputField from "../../../../components/molecules/input"
import Select from "../../../../components/molecules/select"
import StatusSelector from "../../../../components/molecules/status-selector"
import Textarea from "../../../../components/molecules/textarea"
import BodyCard from "../../../../components/organisms/body-card"
import DeletePrompt from "../../../../components/organisms/delete-prompt"
import RadioGroup from "../../../../components/organisms/radio-group"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { getNativeSymbol } from "../../../../utils/prices"
import { useDiscountForm } from "../form/discount-form-context"
import { discountToFormValuesMapper } from "../form/mappers"

const General = ({ discount, isEdit = false }) => {
  const [showPrompt, setShowPrompt] = useState(false)
  const [nativeSymbol, setNativeSymbol] = useState<string | undefined>(
    undefined
  )

  const { regions: opts } = useAdminRegions()
  const deleteDiscount = useAdminDeleteDiscount(discount?.id)
  const updateDiscount = useAdminUpdateDiscount(discount?.id)
  const {
    register,
    control,
    type,
    regions,
    regionsDisabled,
    isFreeShipping,
  } = useDiscountForm()
  const notification = useNotification()

  const onDuplicate = () => {
    if (!discount) {
      notification("Error", "Discount not found", "error")
    }

    navigate(`/a/discounts/new`, {
      state: {
        discount: discountToFormValuesMapper({
          code: discount.code + "_COPY",
          ...discount,
        } as any),
      },
    })
  }

  const onDelete = () => {
    deleteDiscount.mutate(undefined, {
      onSuccess: () => {
        notification("Success", "Discount deleted", "success")
        navigate("/a/discounts")
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  const onUpdateStatus = (status) => {
    updateDiscount.mutate(
      { is_disabled: status },
      {
        onSuccess: () => {
          notification("Success", "Discount status updated", "success")
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  }

  useEffect(() => {
    if (type === "fixed" && regions) {
      let id: string

      if (Array.isArray(regions)) {
        id = regions[0].value
      } else {
        id = ((regions as unknown) as { label: string; value: string }).value // if you change from fixed to percentage, unselect and select a region, and then change back to fixed it is possible to make useForm set regions to an object instead of an array
      }

      const reg = opts?.find((r) => r.id === id)

      if (reg) {
        setNativeSymbol(getNativeSymbol(reg.currency_code))
      }
    }
  }, [type, opts, regions])

  const regionOptions = opts?.map((r) => ({ value: r.id, label: r.name })) || []

  const subtitle = isEdit
    ? "Edit the details of your discount code"
    : "Create a discount code for all or some of your products"

  const editActions: ActionType[] = [
    {
      label: "Duplicate",
      onClick: () => {
        onDuplicate()
      },
      icon: <DuplicateIcon size={20} />,
    },
    {
      label: "Delete",
      onClick: () => {
        setShowPrompt(true)
      },
      icon: <TrashIcon size={20} />,
      variant: "danger",
    },
  ]

  return (
    <>
      <BodyCard
        title="General"
        subtitle={subtitle}
        className="h-auto"
        actionables={isEdit ? editActions : undefined}
        status={
          isEdit ? (
            <StatusSelector
              isDraft={discount.is_disabled}
              activeState="Active"
              draftState="Disabled"
              onChange={() =>
                onUpdateStatus(discount.is_disabled ? false : true)
              }
            />
          ) : undefined
        }
      >
        <div>
          <h3 className="inter-base-semibold mb-2xsmall">
            General information
          </h3>
          <p className="inter-small-regular text-grey-50">
            The code your customers will enter during checkout. Uppercase
            letters and numbers only.
          </p>
          <div className="grid gap-x-xlarge gap-y-base mt-base grid-rows-3 grid-cols-2">
            <InputField
              label="Code"
              placeholder="SUMMERSALE10"
              required
              name="code"
              ref={register({ required: true })}
            />
            <Textarea
              label="Description"
              name="rule.description"
              required
              className="row-span-3"
              placeholder="Summer Sale 2022"
              rows={8}
              ref={register({ required: true })}
            />
            <Controller
              name="regions"
              control={control}
              rules={{
                required: true,
                validate: (value) =>
                  Array.isArray(value) ? value.length > 0 : !!value,
              }}
              render={({ onChange, value }) => {
                return (
                  <Select
                    value={value}
                    onChange={onChange}
                    label="Choose valid regions"
                    isMultiSelect={type !== "fixed"}
                    hasSelectAll={type !== "fixed"}
                    enableSearch
                    required
                    options={regionOptions}
                    id="regionsSelector"
                    className={clsx({
                      ["opacity-50 pointer-events-none select-none"]: regionsDisabled,
                    })}
                    disabled={regionsDisabled}
                  />
                )
              }}
            />
            <InputField
              label="Amount"
              min={0}
              required
              type="number"
              placeholder="10"
              prefix={type === "percentage" ? "%" : nativeSymbol}
              name="rule.value"
              ref={register({ required: !isFreeShipping })}
              className={clsx({
                ["opacity-50 pointer-events-none select-none"]:
                  isFreeShipping || isEdit,
              })}
              tabIndex={isFreeShipping || isEdit ? -1 : 0}
              disabled={isFreeShipping || isEdit}
            />
          </div>
          <Controller
            name="rule.type"
            control={control}
            rules={{ required: true }}
            render={({ onChange, value }) => {
              return (
                <RadioGroup.Root
                  value={value}
                  onValueChange={onChange}
                  className={clsx("flex items-center mt-base", {
                    ["opacity-50 pointer-events-none select-none"]:
                      isFreeShipping || isEdit,
                  })}
                  tabIndex={isFreeShipping ? -1 : 0}
                >
                  <RadioGroup.SimpleItem
                    value="percentage"
                    label="Percentage discount"
                  />
                  <RadioGroup.SimpleItem
                    value="fixed"
                    label="Fixed amount discount"
                    disabled={!!regions && regions.length > 1}
                  />
                  {regions && regions.length > 1 && (
                    <div className="flex items-center">
                      <InfoTooltip
                        content={
                          "Fixed value discounts are not available for multi regional discounts"
                        }
                      />
                    </div>
                  )}
                </RadioGroup.Root>
              )
            }}
          />
          <div className="mt-xlarge flex items-center">
            <Controller
              name="is_dynamic"
              render={({ onChange, value }) => {
                return (
                  <Checkbox
                    label="This is a template discount"
                    name="is_dynamic"
                    id="is_dynamic"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={isEdit}
                    className={clsx("mr-1.5", {
                      ["opacity-50 pointer-events-none select-none"]: isEdit,
                    })}
                  />
                )
              }}
            />
            <InfoTooltip
              content={
                "Template discounts allow you to define a set of rules that can be used across a group of discounts. This is useful in campaigns that should generate unique codes for each user, but where the rules for all unique codes should be the same."
              }
            />
          </div>
        </div>
      </BodyCard>
      {showPrompt && (
        <DeletePrompt
          handleClose={() => setShowPrompt(false)}
          onDelete={async () => onDelete()}
          confirmText="Yes, delete"
          heading="Delete discount"
        />
      )}
    </>
  )
}

export default General
