import { useAdminCustomerGroups } from "medusa-react"
import { useMemo } from "react"
import { Controller } from "react-hook-form"
import DatePicker from "../../../components/atoms/date-picker/date-picker"
import TimePicker from "../../../components/atoms/date-picker/time-picker"
import Switch from "../../../components/atoms/switch"
import { NextSelect } from "../../../components/molecules/select/next-select"
import { weekFromNow } from "../../../utils/date-utils"
import { NestedForm } from "../../../utils/nested-form"
import { PriceListConfigurationFormData } from "../types"

type Props = {
  form: NestedForm<PriceListConfigurationFormData>
}

const PriceListConfigurationForm = ({ form }: Props) => {
  const { control, path } = form
  const { customer_groups, isLoading } = useAdminCustomerGroups()

  const cgOptions = useMemo(() => {
    return (
      customer_groups?.map((cg) => ({ value: cg.id, label: cg.name })) || []
    )
  }, [customer_groups])

  return (
    <div className="flex flex-col gap-y-xlarge">
      <Controller
        name={path("starts_at")}
        control={control}
        render={({ field: { value, onChange, onBlur, ref } }) => {
          return (
            <div ref={ref} onBlur={onBlur}>
              <div className="flex items-center justify-between mb-2xsmall">
                <h3 className="inter-base-semibold">
                  Price overrides has a start date?
                </h3>
                <Switch
                  checked={!!value}
                  onCheckedChange={(checked) => {
                    onChange(checked ? new Date() : null)
                  }}
                />
              </div>
              <p className="inter-base-regular mb-base text-grey-50">
                Schedule the price overrides to activate in the future.
              </p>
              {!!value && (
                <div className="grid grid-cols-2 gap-x-base">
                  <DatePicker date={value} onSubmitDate={onChange} />
                  <TimePicker date={value} onSubmitDate={onChange} />
                </div>
              )}
            </div>
          )
        }}
      />
      <Controller
        name={path("ends_at")}
        control={control}
        render={({ field: { value, onChange, onBlur, ref } }) => {
          return (
            <div ref={ref} onBlur={onBlur}>
              <div className="flex items-center justify-between mb-2xsmall">
                <h3 className="inter-base-semibold">
                  Price overrides has an expiry date?
                </h3>
                <Switch
                  checked={!!value}
                  onCheckedChange={(checked) =>
                    onChange(checked ? weekFromNow() : null)
                  }
                />
              </div>
              <p className="inter-base-regular mb-base text-grey-50">
                Schedule the price overrides to deactivate in the future.
              </p>
              {!!value && (
                <div className="grid grid-cols-2 gap-x-base">
                  <DatePicker date={value} onSubmitDate={onChange} />
                  <TimePicker date={value} onSubmitDate={onChange} />
                </div>
              )}
            </div>
          )
        }}
      />
      <Controller
        name={path("customer_groups")}
        control={control}
        render={({ field: { value, onBlur, onChange, ref } }) => {
          return (
            <div ref={ref} onBlur={onBlur}>
              <div className="flex items-center justify-between mb-2xsmall">
                <h3 className="inter-base-semibold">Customer availabilty</h3>
                <Switch
                  checked={!!value}
                  onCheckedChange={(value) => onChange(value ? [] : null)}
                />
              </div>
              <p className="inter-base-regular mb-base text-grey-50">
                Choose which groups of customers these prices apply to.
              </p>
              {!!value && (
                <NextSelect
                  selectAll
                  isSearchable
                  isClearable
                  value={value}
                  options={cgOptions}
                  onChange={onChange}
                  onBlur={onBlur}
                  label="Customer groups"
                  isLoading={isLoading}
                  pageSize={10}
                  selectedPlaceholder="Customer groups"
                  noOptionsMessage={() => "No customer groups found"}
                />
              )}
            </div>
          )
        }}
      />
      <Controller
        name={path("includes_tax")}
        control={control}
        render={({ field: { value, onBlur, onChange, ref } }) => {
          return (
            <div ref={ref} onBlur={onBlur}>
              <div className="flex items-center justify-between mb-2xsmall">
                <h3 className="inter-base-semibold">Includes taxes</h3>
                <Switch checked={!!value} onCheckedChange={onChange} />
              </div>
              <p className="inter-base-regular mb-base text-grey-50">
                If enabled prices added to the price list will be tax inclusive.
              </p>
            </div>
          )
        }}
      />
    </div>
  )
}

export default PriceListConfigurationForm
