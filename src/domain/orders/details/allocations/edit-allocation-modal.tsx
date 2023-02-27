import React, { useEffect, useMemo } from "react"
import clsx from "clsx"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import Button from "../../../../components/fundamentals/button"
import {
  AllocationLineItem,
  AllocationLineItemForm,
} from "./allocate-items-modal"
import { Controller, useForm, useWatch } from "react-hook-form"
import {
  useAdminDeleteReservation,
  useAdminStockLocations,
  useAdminUpdateReservation,
} from "medusa-react"
import Select from "../../../../components/molecules/select/next-select/select"
import { LineItem, ReservationItemDTO } from "@medusajs/medusa"
import useNotification from "../../../../hooks/use-notification"
import { nestedForm } from "../../../../utils/nested-form"

type EditAllocationLineItemForm = {
  location: { label: string; value: string }
  item: AllocationLineItemForm
}

const EditAllocationDrawer = ({
  close,
  reservation,
  item,
  sales_channel_id,
  totalReservedQuantity,
}: {
  close: () => void
  reservation?: ReservationItemDTO
  item: LineItem
  totalReservedQuantity: number
  sales_channel_id?: string
}) => {
  const form = useForm<EditAllocationLineItemForm>({
    defaultValues: {
      location: { label: "", value: "" },
    },
  })

  const { control, setValue, handleSubmit } = form

  // if not sales channel is present fetch all locations
  const stockLocationsFilter: { sales_channel_id?: string } = {}
  if (sales_channel_id) {
    stockLocationsFilter.sales_channel_id = sales_channel_id
  }

  const { stock_locations } = useAdminStockLocations(stockLocationsFilter)

  console.log(stock_locations)
  const { mutate: updateReservation } = useAdminUpdateReservation(
    reservation?.id || ""
  )
  const { mutate: deleteReservation } = useAdminDeleteReservation(
    reservation?.id || ""
  )

  const locationOptions = useMemo(() => {
    if (!stock_locations) {
      return []
    }
    return stock_locations.map((sl) => ({
      value: sl.id,
      label: sl.name,
    }))
  }, [stock_locations])

  const notification = useNotification()
  const handleDelete = () => {
    deleteReservation(undefined, {
      onSuccess: () => {
        notification("Success", "Allocation deleted successfully", "success")
        close()
      },
      onError: () => {
        notification("Errors", "Failed to deleted ", "success")
      },
    })
  }

  useEffect(() => {
    if (stock_locations?.length && reservation) {
      const defaultLocation = stock_locations.find(
        (sl) => sl.id === reservation.location_id
      )

      if (defaultLocation) {
        console.log(stock_locations)
        console.log(reservation)
        console.log(defaultLocation)

        setValue("location", {
          value: defaultLocation?.id,
          label: defaultLocation?.name,
        })
      }
    }
  }, [stock_locations, reservation, setValue])

  useEffect(() => {
    if (reservation) {
      setValue("item.quantity", reservation?.quantity)
    }
  }, [reservation, setValue])

  const selectedLocation = useWatch({ control, name: "location" })

  console.log(selectedLocation)
  const submit = (data: EditAllocationLineItemForm) => {
    console.log("submit")
    console.log(data)
    updateReservation(
      {
        quantity: data.item.quantity,
        location_id: data.location.value,
      },
      {
        onSuccess: () => {
          notification("Success", "Allocation updated successfully", "success")
          close()
        },
        onError: () => {
          notification("Errors", "Failed to update allocation", "error")
        },
      }
    )
  }

  return (
    <>
      <div
        className={clsx("fixed top-0 left-0 z-40 flex h-screen w-screen", {})}
      >
        <div onClick={close} className={"h-full w-8/12 bg-black opacity-50"} />
        <div className="flex h-full w-4/12 flex-col bg-white text-grey-90">
          <form className="h-full w-full" onSubmit={handleSubmit(submit)}>
            <div className="flex h-full flex-col justify-between ">
              <div>
                <div className="flex items-center justify-between border-b border-grey-20 px-8 py-6">
                  <h1 className="inter-large-semibold ">Edit allocation</h1>
                  <Button variant="ghost" className="p-1.5" onClick={close}>
                    <CrossIcon />
                  </Button>
                </div>
                <div className="flex flex-col gap-y-8 px-8 pt-6">
                  <div>
                    <h2 className="inter-base-semibold">Location</h2>
                    <span className="inter-base-regular text-grey-50">
                      Choose which location you want to ship the items from.
                    </span>
                    <Controller
                      name="location"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Select
                          value={value}
                          onChange={onChange}
                          options={locationOptions}
                        />
                      )}
                    />
                  </div>
                  <div>
                    <h2 className="inter-base-semibold">Items to Allocate</h2>
                    <span className="inter-base-regular text-grey-50">
                      Select the number of items that you wish to allocate.
                    </span>
                    <AllocationLineItem
                      form={nestedForm(form, `item` as "item")}
                      item={item}
                      locationId={selectedLocation?.value}
                      reservedQuantity={0}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    className="my-1 w-full border text-rose-50"
                    size="small"
                    onClick={handleDelete}
                  >
                    Delete allocation
                  </Button>
                </div>
              </div>
              <div className="flex w-full justify-end gap-x-xsmall border-t px-8 pb-6 pt-4">
                <Button
                  variant="ghost"
                  size="small"
                  className="border"
                  onClick={close}
                >
                  Cancel
                </Button>
                <Button variant="primary" size="small" type="submit">
                  Save and close
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default EditAllocationDrawer
