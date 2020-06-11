import React from "react"
import { ThemeProvider } from "../src/theme"

const ThemeDecorator = storyFn => <ThemeProvider>{storyFn()}</ThemeProvider>

export default ThemeDecorator
