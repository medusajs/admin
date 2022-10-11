import React, { ErrorInfo } from "react"
import { analytics } from "../../../services/analytics"
import ErrorComponent from "../error-component"

type State = {
  hasError: boolean
}

type Props = {
  children?: React.ReactNode
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      return // Don't track errors in development
    }

    analytics.track("error", {
      stack: error,
      info: errorInfo,
    })
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorComponent />
    }

    return this.props.children
  }
}

export default ErrorBoundary
