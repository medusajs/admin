import { useLocation } from "@reach/router"
import { navigate } from "gatsby"
import { useAdminRegions } from "medusa-react"
import React from "react"
import RadioGroup from "../../../../components/organisms/radio-group"
import Section from "../../../../components/organisms/section"
import RegionCard from "./region-card"

type Props = {
  id?: string
}

const RegionOverview = ({ id }: Props) => {
  const { regions } = useAdminRegions()
  const [selectedRegion, setSelectedRegion] = React.useState<
    string | undefined
  >(id)

  const router = useLocation()

  const handleChange = (id: string) => {
    if (id !== selectedRegion) {
      setSelectedRegion(id)
      navigate(`/a/settings/regions/${id}`)
    }
  }

  return (
    <Section title="Regions" customActions className="h-full">
      <p className="text-base-regular text-grey-50">
        Manage the markets that you will operate within.
      </p>
      <div className="mt-large">
        <RadioGroup.Root value={selectedRegion} onValueChange={handleChange}>
          {regions?.map((region) => (
            <RegionCard region={region} />
          ))}
        </RadioGroup.Root>
      </div>
    </Section>
  )
}

export default RegionOverview
