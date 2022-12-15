import React, { useEffect, useState } from "react"
import { useAdminSalesChannels } from "medusa-react"

import SideModal from "../../../components/molecules/modal/side-modal"
import Button from "../../../components/fundamentals/button"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import InputField from "../../../components/molecules/input"
import SearchIcon from "../../../components/fundamentals/icons/search-icon"
import SalesChannelTable from "../tables/sales-channels-table"

const LIMIT = 12

type AddSalesChannelsSideModalProps = {
  close: () => void
  isVisible: boolean
  setSelectedChannels: (arg: any) => void
}
/**
 * Modal for adding sales channels to a new PK during creation.
 */
function AddSalesChannelsSideModal(props: AddSalesChannelsSideModalProps) {
  const { isVisible, close, setSelectedChannels } = props

  const [_selectedChannels, _setSelectedChannels] = useState({})

  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState("")

  const {
    sales_channels: data = [],
    isLoading,
    count,
  } = useAdminSalesChannels(
    { q: search, limit: LIMIT, offset },
    { keepPreviousData: true }
  )

  useEffect(() => {
    if (!props.isVisible) {
      setOffset(0)
      setSearch("")
    }
  }, [props.isVisible])

  const onSave = () => {
    setSelectedChannels(_selectedChannels)
    props.close()
  }

  return (
    <SideModal close={close} isVisible={!!isVisible}>
      <div className="flex flex-col justify-between h-[100%] p-6">
        {/* === HEADER === */}

        <div className="flex items-center justify-between">
          <h3 className="inter-large-semibold text-xl text-gray-900 flex items-center gap-2">
            Add sales channels
          </h3>
          <Button variant="ghost" onClick={props.close}>
            <CrossIcon size={20} className="text-grey-40" />
          </Button>
        </div>
        {/* === DIVIDER === */}

        <div className="flex-grow">
          <div className="flex justify-between items-center gap-2">
            <InputField
              name="name"
              type="string"
              value={search}
              className="my-4 h-[40px]"
              placeholder="Find channels"
              prefix={<SearchIcon size={16} />}
              onChange={(ev) => setSearch(ev.target.value)}
            />
          </div>

          <SalesChannelTable
            isEdit
            query={search}
            data={data}
            offset={offset}
            count={count || 0}
            setOffset={setOffset}
            isLoading={isLoading}
            selectedChannels={_selectedChannels}
            setSelectedChannels={_setSelectedChannels}
          />
        </div>
        {/* === DIVIDER === */}

        <div
          className="h-[1px] bg-gray-200 block"
          style={{ margin: "24px -24px" }}
        />
        {/* === FOOTER === */}

        <div className="flex justify-end gap-2">
          <Button size="small" variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={onSave}
            disabled={!Object.keys(_selectedChannels).length}
          >
            Save and close
          </Button>
        </div>
      </div>
    </SideModal>
  )
}

export default AddSalesChannelsSideModal
