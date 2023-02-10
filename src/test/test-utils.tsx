import { render, RenderOptions } from "@testing-library/react"
import { MedusaProvider } from "medusa-react"
import { PropsWithChildren, ReactElement } from "react"
import { LayeredModalProvider } from "../components/molecules/modal/layered-modal"
import { SteppedProvider } from "../components/molecules/modal/stepped-modal"

import { FeatureFlagProvider } from "../context/feature-flag"

import { medusaUrl } from "../services/config"
import queryClient from "../services/queryClient"

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <MedusaProvider
      baseUrl={medusaUrl}
      queryClientProviderProps={{
        client: queryClient,
      }}
    >
      <FeatureFlagProvider>
        <SteppedProvider>
          <LayeredModalProvider>{children}</LayeredModalProvider>
        </SteppedProvider>
      </FeatureFlagProvider>
    </MedusaProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: Providers, ...options })

export * from "@testing-library/react"
export { customRender as render }
