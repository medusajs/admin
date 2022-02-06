import React, { useEffect } from "react"
import { SteppedContext } from "../../../../components/molecules/modal/stepped-modal"
import Select from "../../../../components/molecules/select"

const SelectRegionScreen = ({ handleRegionSelect, region, options }) => {
  const { enableNextPage, disableNextPage } = React.useContext(SteppedContext)

  useEffect(() => {
    if (!region) {
      disableNextPage()
    }
  }, [])

  return (
    <div className="flex flex-col min-h-[705px]">
      <span className="inter-base-semibold mb-4">Choose region</span>
      <Select
        label={"Region"}
        value={region ? { value: region, label: region.name } : null}
        onChange={(option) => {
          if (option) {
            enableNextPage()
          } else {
            disableNextPage()
          }
          handleRegionSelect(option)
        }}
        options={options}
      />
    </div>
  )
}

export default SelectRegionScreen
