import React, { FC } from "react"
import ReactDOM from "react-dom"
import { MedusaProvider } from "medusa-react"
import { ToastProvider } from "react-toast-notifications"
import "./assets/styles/global.css"
import { AccountProvider } from "./context/account"
import { CacheProvider } from "./context/cache"
import { InterfaceProvider } from "./context/interface"
import { medusaUrl, queryClient } from "./services/config"
import App from "./App"
import { FeatureFlagProvider } from "./context/feature-flag"
import { SteppedProvider } from "./components/molecules/modal/stepped-modal"
import { LayeredModalProvider } from "./components/molecules/modal/layered-modal"

const Page: FC = ({ children }) => {
  return (
    <MedusaProvider
      baseUrl={medusaUrl}
      queryClientProviderProps={{
        client: queryClient,
      }}
    >
      <CacheProvider>
        <AccountProvider>
          <FeatureFlagProvider>
            <InterfaceProvider>
              <ToastProvider autoDismiss={true} placement="bottom-left">
                <SteppedProvider>
                  <LayeredModalProvider>{children}</LayeredModalProvider>
                </SteppedProvider>
              </ToastProvider>
            </InterfaceProvider>
          </FeatureFlagProvider>
        </AccountProvider>
      </CacheProvider>
    </MedusaProvider>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Page>
      <App />
    </Page>
  </React.StrictMode>,
  document.getElementById("root")
)
