import React from "react"
import Button from "../../fundamentals/button"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import SearchIcon from "../../fundamentals/icons/search-icon"
import { LayeredModalContext } from "../../molecules/modal/layered-modal"
import { useAddChannelsModalScreen } from "./add-channels-modal-screen"

type AvailableChannelsModalScreenProps = {
  selectedChannelIds: string[]
}

const AvailableChannelsModalScreen: React.FC<AvailableChannelsModalScreenProps> = ({
  selectedChannelIds,
}) => {
  const { push } = React.useContext(LayeredModalContext)
  const addChannelModalScreen = useAddChannelsModalScreen()
  // TABLE

  return (
    <div>
      <div className="flex justify-between">
        <Button variant="ghost" size="small" className="border border-grey-20">
          filters
        </Button>
        <div className="flex">
          <Button
            variant="ghost"
            size="small"
            className="border border-grey-20"
            onClick={() => push(addChannelModalScreen)}
          >
            <PlusIcon size={20} /> Add Channels
          </Button>
          <Button
            variant="ghost"
            size="small"
            className="border border-grey-20"
          >
            <SearchIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AvailableChannelsModalScreen
