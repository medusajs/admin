import { action } from "@storybook/addon-actions"
import { Toaster } from "react-hot-toast"
import "../src/assets/styles/global.css"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

global.___loader = {
  enqueue: () => {},
  hovering: () => {},
}
// Gatsby internal mocking to prevent unnecessary errors in storybook testing environment
global.__PATH_PREFIX__ = ""
global.__BASE_PATH__ = "/"

// This is to utilized to override the window.___navigate method Gatsby defines and uses to report what path a Link would be taking us to if it wasn't inside a storybook
window.___navigate = (pathname) => {
  action("NavigateTo:")(pathname)
}

export const decorators = [
  (Story) => {
    return (
      <>
        <Story />
        <Toaster
          containerStyle={{
            top: 74,
            left: 24,
            bottom: 24,
            right: 24,
          }}
        />
      </>
    )
  },
]
