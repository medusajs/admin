import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { useAdminDeletePriceListProductPrices } from "medusa-react"
import { useMemo } from "react"
import { Column } from "react-table"
import EditIcon from "../../../../../../components/fundamentals/icons/edit-icon"
import SortingIcon from "../../../../../../components/fundamentals/icons/sorting-icon"
import TrashIcon from "../../../../../../components/fundamentals/icons/trash-icon"
import ImagePlaceholder from "../../../../../../components/fundamentals/image-placeholder"
import Actionables, {
  ActionType,
} from "../../../../../../components/molecules/actionables"
import useImperativeDialog from "../../../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../../utils/error-messages"

type UseColumsProps = {
  id: string
}

export const useColumns = ({ id }: UseColumsProps) => {
  const columns = useMemo(() => {
    const cols: Column<PricedProduct>[] = [
      {
        Header: ({ column: { isSorted, isSortedDesc } }) => (
          <div className="flex items-center gap-x-2xsmall">
            <span>Title</span>
            <SortingIcon
              className="text-grey-40"
              ascendingColor={isSorted && !isSortedDesc ? "#111827" : undefined}
              descendingColor={isSortedDesc ? "#111827" : undefined}
              size={16}
            />
          </div>
        ),
        accessor: "title",
        Cell: ({ value, row: { original } }) => (
          <div className="flex items-center">
            <div className="h-[40px] w-[30px] my-1.5 flex items-center mr-4">
              {original.thumbnail ? (
                <img
                  src={original.thumbnail}
                  className="h-full object-cover rounded-soft"
                />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
            <span>{value}</span>
          </div>
        ),
      },
      {
        Header: ({ column: { isSorted, isSortedDesc } }) => (
          <div className="flex items-center gap-x-2xsmall">
            <span>Collection</span>
            <SortingIcon
              className="text-grey-40"
              ascendingColor={isSorted && !isSortedDesc ? "#111827" : undefined}
              descendingColor={isSortedDesc ? "#111827" : undefined}
              size={16}
            />
          </div>
        ),
        accessor: "collection",
        Cell: ({ value }) => <span>{value?.title ?? "-"}</span>,
      },
      {
        Header: () => (
          <div className="text-right w-full">
            <span>Variants</span>
          </div>
        ),
        accessor: "variants",
        Cell: ({ value }) => (
          <div className="text-right w-full">
            <span>{value.length}</span>
          </div>
        ),
      },
      {
        Header: () => null,
        id: "actions",
        Cell: ({ row: { original } }) => {
          const prodId = original.id
          const deletePrompt = useImperativeDialog()
          const notification = useNotification()

          const { mutate } = useAdminDeletePriceListProductPrices(id, prodId)

          const onDelete = async () => {
            const shouldDelete = await deletePrompt({
              heading: "Delete product prices from price list?",
              text: "Are you sure you want to delete all prices for this product from the price list?",
              confirmText: "Yes, delete",
              cancelText: "No, cancel",
            })

            if (!shouldDelete) {
              return
            }

            mutate(undefined, {
              onSuccess: () => {
                notification(
                  "Prices deleted",
                  "Successfully deleted prices from price list",
                  "success"
                )
              },
              onError: (err) => {
                notification(
                  "Error deleting prices",
                  getErrorMessage(err),
                  "error"
                )
              },
            })
          }

          const actions: ActionType[] = [
            {
              label: "Edit prices",
              onClick: () => console.log("Edit prices"),
              icon: <EditIcon size={20} />,
            },
            {
              label: "Delete",
              onClick: onDelete,
              icon: <TrashIcon size={20} />,
              variant: "danger",
            },
          ]

          return (
            <div className="justify-end flex">
              <Actionables actions={actions} />
            </div>
          )
        },
      },
    ]

    return cols
  }, [id])

  return columns
}
