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
import Modal from "../../molecules/modal"
import CustomerResults from "./customer-results"
import DiscountResults from "./discount-results"
import KeyboardShortcuts from "./keyboard-shortcuts"
import ProductResults from "./product-results"
import useKeyboardNavigationList from "./use-keyboard-navigation-list"

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

  const totalLength = getTotal(products?.slice(0, 5), discounts, customers)

  const {
    getInputProps,
    getLIProps,
    getULProps,
    selected,
  } = useKeyboardNavigationList({
    length: totalLength,
  })

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body className="rounded-rounded">
        <div className="px-xlarge py-large">
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
          <KeyboardShortcuts className="mt-xlarge flex items-center gap-x-3 text-grey-40" />
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
                    offset={customers?.length}
                    getLIProps={getLIProps}
                    selected={selected}
                  />
                </div>

                <div className="mt-xlarge">
                  <ProductResults
                    products={products}
                    offset={customers?.length + discounts?.length}
                    getLIProps={getLIProps}
                    selected={selected}
                  />
                </div>
              </ul>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default SearchModal
