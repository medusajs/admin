import {
  useAdminCustomers,
  useAdminDiscounts,
  useAdminProducts,
} from "medusa-react"
import React from "react"
import { useDebounce } from "../../../hooks/use-debounce"
import Spinner from "../../atoms/spinner"
import Input from "../../atoms/text-input"
import SearchIcon from "../../fundamentals/icons/search-icon"
import * as RadixDialog from "@radix-ui/react-dialog"
import CustomerResults from "./results/customer-results"
import DiscountResults from "./results/discount-results"
import KeyboardShortcuts from "./keyboard-shortcuts"
import ProductResults from "./results/product-results"
import useKeyboardNavigationList from "./use-keyboard-navigation-list"
import clsx from "clsx"

const getTotal = (...lists) =>
  lists.reduce((total, list = []) => total + list.length, 0)

const SearchModal = ({ handleClose }) => {
  const [q, setQ] = React.useState("")
  const query = useDebounce(q, 500)
  const onChange = (e) => setQ(e.target.value)

  const { customers, isFetching: isFetchingCustomers } = useAdminCustomers(
    {
      q: query,
      limit: 5,
      offset: 0,
    },
    { enabled: !!query, keepPreviousData: true }
  )
  const { discounts, isFetching: isFetchingDiscounts } = useAdminDiscounts(
    { q: query, limit: 5, offset: 0 },
    { enabled: !!query, keepPreviousData: true }
  )
  const { products, isFetching: isFetchingProducts } = useAdminProducts(
    { q: query, limit: 5 },
    { enabled: !!query, keepPreviousData: true }
  )

  const isFetching =
    isFetchingDiscounts || isFetchingCustomers || isFetchingProducts

  const totalLength = getTotal(products, discounts, customers)

  const {
    getInputProps,
    getLIProps,
    getULProps,
    selected,
  } = useKeyboardNavigationList({
    length: totalLength,
  })

  return (
    <RadixDialog.Root open onOpenChange={handleClose}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed z-50 inset-0">
          <RadixDialog.Content
            className={clsx(
              "fixed overflow-y-auto bg-grey-0 min-w-modal rounded-rounded shadow-searchModal",
              "-translate-x-1/2 top-[15%] left-1/2",
              { "bottom-[15%]": totalLength > 0 }
            )}
          >
            <div className="px-xlarge py-large flex flex-col">
              <div className="flex items-center gap-x-4 pb-large border-solid border-b -mx-xlarge px-xlarge border-grey-20">
                <SearchIcon className="text-grey-40" />
                <Input
                  className="flex-1"
                  onChange={onChange}
                  value={q}
                  placeholder="Search typing to search..."
                  {...getInputProps()}
                />
              </div>
              <KeyboardShortcuts className="mt-xlarge flex items-center gap-x-3 text-grey-40 inter-small-regular" />
              {totalLength > 0 ? (
                <div className="mt-large">
                  {isFetching ? (
                    <div className="w-full pt-2xlarge flex items-center justify-center">
                      <Spinner size={"large"} variant={"secondary"} />
                    </div>
                  ) : (
                    <ul {...getULProps()}>
                      <div>
                        <CustomerResults
                          customers={customers}
                          offset={0}
                          getLIProps={getLIProps}
                          selected={selected}
                        />
                      </div>

                      <div className="mt-xlarge">
                        <DiscountResults
                          discounts={discounts}
                          offset={customers?.length || 0}
                          getLIProps={getLIProps}
                          selected={selected}
                        />
                      </div>

                      <div className="mt-xlarge">
                        <ProductResults
                          products={products}
                          offset={getTotal(customers, discounts)}
                          getLIProps={getLIProps}
                          selected={selected}
                        />
                      </div>
                    </ul>
                  )}
                </div>
              ) : null}
            </div>
          </RadixDialog.Content>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}

export default SearchModal
