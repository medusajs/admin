import { useAdminShippingProfiles } from "medusa-react"
import { useMemo } from "react"

export const useShippingOptionFormData = () => {
  const { shipping_profiles } = useAdminShippingProfiles()

  const shippingProfileOptions = useMemo(() => {
    return (
      shipping_profiles?.map((profile) => ({
        value: profile.id,
        label: profile.name,
      })) || []
    )
  }, [shipping_profiles])

  return { shippingProfileOptions }
}
