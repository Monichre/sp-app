import React from 'react';
import { ButtonSignout } from './Authed/AuthedAppBar';
import styled from 'styled-components';
import LogRocket from 'logrocket'

const ErrorPage = styled.div`
  text-align: center;
  padding: 1rem;
`

export const ErrorFallback: React.SFC<{error?: Error | null, errorInfo?: any}> = ({error, errorInfo}) =>
<ErrorPage>
<h1>Something went wrong.</h1>
{/* <h2>This will be reported to the proper authorities.</h2> */}
<h2>Have you tried turning it off and on again?</h2>
<ButtonSignout/>
</ErrorPage>

export class ErrorBoundary extends React.Component<{}, {error: Error | null, errorInfo: any}> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error, errorInfo: any) {
    return { error,  errorInfo };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error,
      errorInfo
    })
    LogRocket.captureException(error, { extra: { errorInfo }})
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return <ErrorFallback {...this.state}/>
    }

    return this.props.children; 
  }

}