import React from "react"
import { ThemeProvider } from "../src/services/theme"

const ThemeDecorator = storyFn => <ThemeProvider>{storyFn()}</ThemeProvider>

export default ThemeDecorator
