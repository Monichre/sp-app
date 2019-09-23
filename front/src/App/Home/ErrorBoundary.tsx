import React from 'react';
import { ButtonSignout } from '../../shared/ui';
import styled from 'styled-components';
import LogRocket from 'logrocket'
import * as Sentry from '@sentry/browser';

const ErrorPage = styled.div`
  text-align: center;
  padding: 1rem;
`

export const ErrorFallback: React.SFC<{ error?: Error | null, errorInfo?: any }> = ({ error, errorInfo }) =>
  <ErrorPage>
    <h1>Something went wrong.</h1>
    {/* <h2>This will be reported to the proper authorities.</h2> */}
    <h2>Have you tried turning it off and on again?</h2>
    <ButtonSignout />
  </ErrorPage>

export class ErrorBoundary extends React.Component<{}, { error: Error | null, errorInfo: any, eventId: any }> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, errorInfo: null, eventId: null };
  }

  static getDerivedStateFromError (error: Error, errorInfo: any) {
    return { error, errorInfo };
  }

  componentDidCatch (error: Error, errorInfo: any) {
    Sentry.withScope((scope: any) => {
      scope.setExtras(errorInfo)

      const eventId: any = Sentry.captureException(error);
      LogRocket.captureException(error, { extra: { errorInfo } })

      // @ts-ignore
      this.setState({ eventId })
    });

    console.log(error, errorInfo);
  }

  render () {
    if (this.state.error) {
      return process.env.NODE_ENV !== 'production' ? <ErrorPage>
        <h1>Something went wrong.</h1>
        <button onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}>Report feedback</button>
        <ButtonSignout />
      </ErrorPage>
        :

        <ErrorFallback {...this.state} />
    }

    return this.props.children;
  }

}