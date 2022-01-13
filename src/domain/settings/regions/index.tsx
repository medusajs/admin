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

const Regions = () => {
  const { regions, isLoading } = useAdminRegions()
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  useEffect(() => {
    const setRegion = () => {
      if (!isLoading && selectedRegion === null) {
        setSelectedRegion(regions[0].id)
      }
    }

    setRegion()
  }, [regions, isLoading, selectedRegion])

  return (
    // <Flex flexDirection="column" pb={5} pt={5}>
    //   <Card px={0}>
    //     <BreadCrumb
    //       previousRoute="/a/settings"
    //       previousBreadCrumb="Settings"
    //       currentPage="Regions"
    //     />
    //     <Flex>
    //       <Text mb={3} fontSize={20} fontWeight="bold">
    //         Regions
    //       </Text>
    //       <Box ml="auto" />
    //       <Button
    //         variant="primary"
    //         onClick={() => navigate("/a/settings/regions/new")}
    //       >
    //         + Add region
    //       </Button>
    //     </Flex>
    //     <Card.Body py={0} flexDirection="column">
    //       {isLoading ? (
    //         <Flex
    //           flexDirection="column"
    //           alignItems="center"
    //           height="100vh"
    //           mt="auto"
    //         >
    //           <Box height="75px" width="75px" mt="50%">
    //             <Spinner dark />
    //           </Box>
    //         </Flex>
    //       ) : (
    //         regions.map(r => (
    //           <Flex
    //             key={r.id}
    //             py={3}
    //             width={1}
    //             sx={{
    //               alignItems: "center",
    //               justifyContent: "space-between",
    //               flexWrap: "wrap",
    //               borderBottom: "1px solid",
    //               borderColor: "muted",
    //             }}
    //           >
    //             <Box>
    //               <Box
    //                 width={1}
    //                 maxWidth="400px"
    //                 fontWeight="500"
    //                 sx={{
    //                   textOverflow: "ellipsis",
    //                   whiteSpace: "nowrap",
    //                   overflow: "hidden",
    //                 }}
    //               >
    //                 {r.name} ({r.countries.map(c => c.display_name).join(", ")})
    //               </Box>
    //               <Box width={1} mt={1}>
    //                 <Text color="gray">
    //                   Payment providers:{" "}
    //                   {r.payment_providers
    //                     .map(pp => paymentProvidersMapper(pp.id).label)
    //                     .join(", ") || "not configured"}
    //                 </Text>
    //                 <Text color="gray">
    //                   Fulfillment providers:{" "}
    //                   {r.fulfillment_providers
    //                     .map(fp => fulfillmentProvidersMapper(fp.id).label)
    //                     .join(", ") || "not configured"}
    //                 </Text>
    //               </Box>
    //             </Box>
    //             <Box>
    //               <Button
    //                 variant="primary"
    //                 onClick={() => navigate(`/a/settings/regions/${r.id}`)}
    //               >
    //                 Edit
    //               </Button>
    //             </Box>
    //           </Flex>
    //         ))
    //       )}
    //     </Card.Body>
    //   </Card>
    // </Flex>
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
            { icon: <PlusIcon />, label: "Add region", onClick: () => {} },
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
        {selectedRegion && <RegionDetails id={selectedRegion} />}
      </TwoSplitPane>
    </div>
  )
}

export default Regions
