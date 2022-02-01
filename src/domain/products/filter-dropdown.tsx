import React, { useState, useRef, useEffect } from "react"
import * as RadixPopover from "@radix-ui/react-popover"

import styled from "@emotion/styled"
import { Flex, Box } from "rebass"

import TagInput from "../../components/molecules/tag-input"
import Button from "../../components/fundamentals/button"
import FilterDropdownItem from "../../components/molecules/filter-dropdown/item"
import Tooltip from "../../components/tooltip"
import ReactTooltip from "react-tooltip"
import { ReactComponent as Filter } from "../../assets/svg/filter.svg"
import { DateFilters } from "../../utils/filters"
import FilterDropdownContainer from "../../components/molecules/filter-dropdown/container"
import CheckIcon from "../../components/fundamentals/icons/check-icon"
import clsx from "clsx"
import SaveFilterItem from "../../components/molecules/filter-dropdown/save-field"
<<<<<<< HEAD
import ChevronDownIcon from "../../components/fundamentals/icons/chevron-down"
=======
>>>>>>> feat/revamp

const statusFilters = ["proposed", "draft", "published", "rejected"]

const ProductsFilter = ({
  setStatusFilter,
  statusFilter,
  setCollectionFilter,
  collectionFilter,
  collections,
  setTagsFilter,
  submitFilters,
  clearFilters,
  tagsFilter,
  resetFilters,
<<<<<<< HEAD
=======
  sx,
>>>>>>> feat/revamp
  ...rest
}) => {
  const [name, setName] = useState("")
  const [tagsFocussed, setTagsFocussed] = useState(false)
  const ref = useRef(null)
  const tagsRef = useRef(null)

  const onSubmit = () => {
    submitFilters()
  }

  const onClear = () => {
    clearFilters()
  }

<<<<<<< HEAD
  const numberOfFilters = [statusFilter, collectionFilter, tagsFilter].reduce(
    (prev, curr) => prev + (curr.open ? 1 : 0),
    0
  )

=======
>>>>>>> feat/revamp
  return (
    <FilterDropdownContainer
      submitFilters={onSubmit}
      clearFilters={onClear}
      triggerElement={
<<<<<<< HEAD
        <div
          className={clsx(
            "inter-small-regular text-grey-50 flex items-center pl-1.5 pr-0.5 rounded"
          )}
        >
          <div className="flex items-center">
            Custom filter:
            <div className="text-grey-40 ml-0.5 flex px-1.5 active:bg-grey-5 hover:bg-grey-5 cursor-pointer items-center rounded">
              <span className="text-violet-60 inter-small-semibold">
                {numberOfFilters ? numberOfFilters : ""}
              </span>
              <ChevronDownIcon size={16} />
            </div>
          </div>
        </div>
=======
        <Button size="small" variant="primary">
          Filter
        </Button>
>>>>>>> feat/revamp
      }
    >
      <FilterDropdownItem
        filterTitle="Status"
        options={statusFilters}
        filters={statusFilter.filter}
        open={statusFilter.open}
        setFilter={setStatusFilter}
      />

      <FilterDropdownItem
        filterTitle="Collection"
        options={collections}
        filters={collectionFilter.filter}
        open={collectionFilter.open}
        setFilter={(obj) => {
          setCollectionFilter(obj)
        }}
      />
      <div className="flex flex-col w-full pb-2">
        <div
          className="flex w-full items-center px-3 mb-1 py-1.5 hover:bg-grey-5 rounded cursor-pointer"
          onClick={() =>
            setTagsFilter({
              open: !tagsFilter.open,
              filter: tagsFilter.filter,
            })
          }
        >
          <div
            className={`w-5 h-5 flex justify-center border-grey-30 border text-grey-0 rounded-base ${
              tagsFilter.open && "bg-violet-60"
            }`}
          >
            <span className="self-center">
              {tagsFilter.open && <CheckIcon size={16} />}
            </span>
            <input
              type="checkbox"
              className="hidden"
              id="Tags"
              name="Tags"
              value="Tags"
              checked={tagsFilter.open}
            />
          </div>
          <span
            className={clsx("text-grey-90 ml-2", {
              "inter-small-semibold": tagsFilter.open,
              "inter-small-regular": !tagsFilter.open,
            })}
          >
            Tags
          </span>
        </div>

        {tagsFilter.open && (
          <div
            ref={tagsRef}
            data-tip={tagsFilter.invalidTagsMessage || ""}
            className="pl-6"
            onBlur={() => setTagsFocussed(false)}
            onFocus={() => setTagsFocussed(true)}
          >
            <TagInput
              className="pt-0 pb-1"
              showLabel={false}
              placeholder="Spring, summer..."
              values={tagsFilter.filter || []}
              onBlur={() => {
                setTagsFocussed(false)
              }}
              onChange={(values) => {
                setTagsFilter({
                  open: tagsFilter.open,
                  filter: values,
                })
              }}
            />
          </div>
        )}
      </div>
      <SaveFilterItem saveFilter={console.log} name={name} setName={setName} />
    </FilterDropdownContainer>
  )
}

export default ProductsFilter
