import { Component, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children?: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>
    }

    return this.props.children
  }
}

export default ErrorBoundary
