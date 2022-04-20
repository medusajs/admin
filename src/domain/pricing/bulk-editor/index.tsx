import React from "react"
import clsx from "clsx"

import { ProductVariant } from "@medusajs/medusa"

import Fade from "../../../components/atoms/fade-wrapper"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import NativeSelect from "../../../components/molecules/native-select"
import TableFieldsFilters from "../../../components/molecules/table-fileds-filter"
import TableSearch from "../../../components/molecules/table/table-search"

function generateField(name: string) {
  return {
    id: name.toLowerCase().split(" ").join("-"),
    short: name,
    label: ({ isSelected }) => (
      <span className="text-small text-grey-50">
        <span className={clsx("text-grey-90", { "font-semibold": isSelected })}>
          {name}
        </span>
        {name.toUpperCase()}
      </span>
    ),
  }
}

function PriceListBulkEditorHeader() {
  return (
    <div className="flex justify-center my-[30px]">
      <div className="medium:w-8/12 w-full px-8 flex justify-between">
        <div className="flex items-center">
          <span className="text-small font-semibold text-grey-50">
            Price list:
          </span>
          <NativeSelect defaultValue="TODO 1">
            <NativeSelect.Item value="TODO 1">TODO 1</NativeSelect.Item>
            <NativeSelect.Item value="TODO 2">TODO 2</NativeSelect.Item>
          </NativeSelect>
        </div>
        <TableFieldsFilters
          fields={["hrk", "dkk", "usd"].map(generateField)}
          onChange={console.log}
        />
        <TableSearch />
      </div>
    </div>
  )
}
type ProductVariantsSectionProps = {
  variant: ProductVariant
}

function ProductVariantsSection(props: ProductVariantsSectionProps) {
  const { variant } = props
  return <div>{variant.title}</div>
}

type PriceListBulkEditorProps = {
  variants: ProductVariant[]
}

function PriceListBulkEditor(props: PriceListBulkEditorProps) {
  const { variants } = props

  return (
    <Fade isVisible isFullScreen={true}>
      <FocusModal>
        <FocusModal.Header>
          <div className="medium:w-8/12 w-full px-8 flex justify-between">
            <div className="flex items-center gap-4">
              <Button
                size="small"
                variant="ghost"
                // onClick={closeForm}
                className="border rounded-rounded w-8 h-8"
              >
                <CrossIcon size={20} />
              </Button>
              <span className="font-semibold text-grey-90 text-large">
                Bulk editor
              </span>
            </div>
            <div className="gap-x-small flex">
              <Button
                // onClick={handleSubmit(submitGhost)}
                size="small"
                variant="ghost"
                className="border rounded-rounded"
              >
                Discard
              </Button>
              <Button
                size="small"
                // variant="primary"
                // onClick={handleSubmit(submitCTA)}
                className="rounded-rounded"
              >
                Save
              </Button>
            </div>
          </div>
        </FocusModal.Header>

        <FocusModal.Main>
          <PriceListBulkEditorHeader />

          {variants.map((v) => (
            <ProductVariantsSection key={v.id} variant={v} />
          ))}
        </FocusModal.Main>
      </FocusModal>
    </Fade>
  )
}

export default PriceListBulkEditor
