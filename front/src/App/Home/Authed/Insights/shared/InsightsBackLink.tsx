import React from 'react';
import styled from 'styled-components'
import { Previous } from 'grommet-icons';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';

const Back: any = styled(Previous)`
  cursor: pointer;
`

const focusFrom = (path: string) => path.split('/').slice(5,99).join('/')

const insightPathFrom = (path: string) => path.split('/').slice(0,5).join('/')

const backUntilNewFocus = (history: History) => {
  const startFocus = focusFrom(window.location.pathname)
  const insightPath = insightPathFrom(window.location.pathname)
  console.log('startFocus, insightPath', startFocus, insightPath)
  window.onpopstate = (...args) => {
    console.log('onpopstate', args, window.location.pathname)
    if (startFocus === focusFrom(window.location.pathname)) {
      console.log('back again!')
      history.goBack()
    } else {
      if (!(focusFrom(window.location.pathname)[0] === 'insights')) {
        return
      }
      const endFocus = focusFrom(window.location.pathname)
      const endPath = insightPath + (endFocus > '' ? `/${endFocus}` : '')
      // window.location.assign()
      console.log('pushState', endPath)
      history.push(endPath)
      console.log('unload onpopstate handler')
      window.onpopstate = null
    }
  }
  window.history.back()
  // while (focusFrom(window.history.state) === startFocus) {
  //   window.history.back()
  // }
}

export const BackLinkWithoutRouter: React.SFC<RouteComponentProps> = ({history}) =>
  <Back onClick={() => backUntilNewFocus(history)} color='white' size='3rem'/>

export const InsightsBackLink: any = withRouter(BackLinkWithoutRouter)