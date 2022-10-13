import { User } from "@medusajs/medusa"
import React from "react"
import Badge from "../../../../components/fundamentals/badge"
import Button from "../../../../components/fundamentals/button"
import { useAdminAnalyticsConfig } from "../../../../services/analytics"

type Props = {
  user?: Omit<User, "password_hash">
}

const UsageInsights = ({ user }: Props) => {
  const { analytics_config } = useAdminAnalyticsConfig(user?.id)

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-y-2xsmall">
        <div className="flex items-center gap-x-xsmall">
          <h2 className="inter-base-semibold">Usage insights</h2>
          <Badge variant="success">Active</Badge>
        </div>
        <p className="inter-base-regular text-grey-50">
          Share interaction insights and help us improve Medusa
        </p>
      </div>
      <Button variant="secondary" size="small">
        Edit preferences
      </Button>
    </div>
  )
}

export default UsageInsights
