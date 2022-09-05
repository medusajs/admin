import { SalesChannel } from "@medusajs/medusa"
import clsx from "clsx"
import { useAdminSalesChannels, useAdminStore } from "medusa-react"
import React, { useEffect, useMemo } from "react"
import { useFieldArray } from "react-hook-form"
import Switch from "../../../components/atoms/switch"
import Badge from "../../../components/fundamentals/badge"
import Button from "../../../components/fundamentals/button"
import ChannelsIcon from "../../../components/fundamentals/icons/channels-icon"
import SalesChannelsDisplay from "../../../components/molecules/sales-channels-display"
import useToggleState from "../../../hooks/use-toggle-state"
import { NestedForm } from "../../../utils/nested-form"
import SalesChannelsModal from "../components/sales-channels-modal"

export type AddSalesChannelsFormType = {
  channels: SalesChannel[]
}

type Props = {
  form: NestedForm<AddSalesChannelsFormType>
}

const AddSalesChannelsForm = ({ form }: Props) => {
  const { control, path } = form

  const { fields, replace, append } = useFieldArray({
    control,
    name: path("channels"),
    keyName: "fieldId",
  })

  const { state: isEnabled, toggle: toggleEnabled } = useToggleState()
  const {
    state: open,
    toggle: toggleModal,
    close: closeModal,
  } = useToggleState()
  const { store } = useAdminStore()
  const { count } = useAdminSalesChannels()

  const onAddChannels = (channels: SalesChannel[]) => {
    replace(channels)
  }

  const remainder = useMemo(() => {
    return Math.max(fields?.length - 3, 0)
  }, [fields])

  useEffect(() => {
    if (store?.default_sales_channel && fields) {
      const alreadyAdded = fields.find(
        ({ id }) => id === store.default_sales_channel.id
      )

      if (!alreadyAdded) {
        append(store.default_sales_channel)
      }
    }
  }, [store])

  return (
    <>
      <div>
        <div>
          <div className="flex items-center justify-between">
            <h2 className="inter-base-semibold">Sales channels</h2>
            <Switch checked={isEnabled} onCheckedChange={toggleEnabled} />
          </div>
          <p className="inter-base-regular text-grey-50 mt-2xsmall">
            This product will only be available in the default sales channel if
            left untouched.
          </p>
        </div>
        <div
          className={clsx({
            hidden: !isEnabled,
          })}
        >
          <div className="mt-base">
            <SalesChannelsDisplay channels={fields} />
          </div>
          <Button
            variant="secondary"
            className="w-full h-[40px] mt-large"
            type="button"
            onClick={toggleModal}
          >
            <ChannelsIcon size={20} />
            <span>Change availablity</span>
          </Button>
        </div>
      </div>
      <SalesChannelsModal
        source={fields}
        open={open}
        onClose={closeModal}
        onSave={onAddChannels}
      />
    </>
  )
}

type SalesChannelBadgeProps = {
  channel: SalesChannel
}

const SalesChannelBadge: React.FC<SalesChannelBadgeProps> = ({ channel }) => {
  return (
    <Badge variant="ghost" className="px-3 py-1.5">
      <div className="flex items-center">
        <span className="inter-small-regular text-grey-90">{channel.name}</span>
      </div>
    </Badge>
  )
}

export default AddSalesChannelsForm
