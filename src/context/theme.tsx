import clsx from "clsx"
import React from "react"

const defaultContext = {
  theme: "light",
  changeTheme: (theme: string) => {},
  changeAccent: (accentCode: string) => {},
}

export const ThemeContext = React.createContext(defaultContext)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState("light")
  const [accent, setAccent] = React.useState("violet")

  const changeAccent = (accentCode: string) => {
    setAccent(accentCode)
  }

  const changeTheme = (theme: string) => {
    setTheme(theme)
  }

  return (
    <ThemeContext.Provider value={{ theme, changeAccent, changeTheme }}>
      <div className={clsx({ dark: theme === "dark" })}>{children}</div>
    </ThemeContext.Provider>
  )
}
