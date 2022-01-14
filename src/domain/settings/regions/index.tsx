import { useAdminRegions } from "medusa-react"
import React, { useEffect, useState } from "react"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import RadioGroup from "../../../components/organisms/radio-group"
import TwoSplitPane from "../../../components/templates/two-split-pane"
import fulfillmentProvidersMapper from "../../../utils/fulfillment-providers.mapper"
import paymentProvidersMapper from "../../../utils/payment-providers-mapper"
import RegionDetails from "./details"
import NewRegion from "./new"

const Regions = () => {
  const { regions, isLoading, refetch } = useAdminRegions()
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [addRegion, setAddRegion] = useState(false)

  useEffect(() => {
    const setRegion = () => {
      if (!isLoading && selectedRegion === null) {
        setSelectedRegion(regions[0].id)
      }
    }

    setRegion()
  }, [regions, isLoading, selectedRegion])

  return (
    <>
      <div>
        <BreadCrumb
          previousRoute="/a/settings"
          previousBreadcrumb="Settings"
          currentPage="Regions"
        />
        <TwoSplitPane>
          <BodyCard
            title="Regions"
            subtitle="Manage the markets that you will operate within"
            actionables={[
              {
                icon: <PlusIcon />,
                label: "Add region",
                onClick: () => setAddRegion(!addRegion),
              },
            ]}
          >
            {isLoading ? (
              <p>loading</p>
            ) : (
              <RadioGroup
                defaultValue={regions[0].id}
                onValueChange={setSelectedRegion}
              >
                {regions.map(r => {
                  const providers = `Payment providers: ${
                    r.payment_providers
                      .map(pp => paymentProvidersMapper(pp.id).label)
                      .join(", ") || "not configured"
                  } - Fulfillment providers: ${
                    r.fulfillment_providers
                      .map(fp => fulfillmentProvidersMapper(fp.id).label)
                      .join(", ") || "not configured"
                  }`
                  return (
                    <RadioGroup.Item
                      label={r.name}
                      sublabel={`(${r.countries
                        .map(c => c.display_name)
                        .join(", ")})`}
                      description={providers}
                      value={r.id}
                      key={r.id}
                    ></RadioGroup.Item>
                  )
                })}
              </RadioGroup>
            )}
          </BodyCard>
          {selectedRegion && (
            <RegionDetails id={selectedRegion} onDelete={setSelectedRegion} />
          )}
        </TwoSplitPane>
      </div>
      {addRegion && (
        <NewRegion onClick={() => setAddRegion(!addRegion)} onDone={refetch} />
      )}
    </>
  )
}

export default Regions
