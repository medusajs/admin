import { Component } from "react"
import React from "react"
import ReactDOM from "react-dom"
import { ThemeProvider as Provider } from "../../theme"

// Use a ternary operator to make sure that the document object is defined
const portalRoot =
  typeof document !== `undefined` ? document.getElementById("portal") : null

export default class Portal extends Component {
  constructor() {
    super()
    // Use a ternary operator to make sure that the document object is defined
    this.el =
      typeof document !== `undefined` ? document.createElement("div") : null
    if (this.el) {
      // prevent scrolling when dropdown is open
      this.el.style.position = "fixed"
      this.el.style.overflow = "hidden"
      this.el.style.inset = 0
    }
  }

  componentDidMount = () => {
    portalRoot.appendChild(this.el)
  }

  componentWillUnmount = () => {
    portalRoot.removeChild(this.el)
  }

  render() {
    const { children } = this.props

    // Check that this.el is not null before using ReactDOM.createPortal
    if (this.el) {
      return ReactDOM.createPortal(<Provider>{children}</Provider>, this.el)
    } else {
      return null
    }
  }
}
