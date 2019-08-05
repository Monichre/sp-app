import React, { useEffect} from 'react';
import { RouteComponentProps, Switch, Route, Redirect } from 'react-router';
import { Main } from './Main/Main';
import { Artist } from './Artist';
import { TPathParams } from './shared';
import { Genre } from './Genre';


/**
 *
 * cc: Insights Component; Uses routing to configure which insights are queried...
 *
 */


export const Insights: React.SFC<RouteComponentProps<TPathParams> & { uid: string, user: any, setUserAchievements: Function}> =
  ({ uid, user, history: { location: { pathname } }, match: { path, params }, ...rest }) => {
  const focus = pathname.split('/').slice(5,99).join('/')
  const pathParams = { focus, ...params }

    useEffect(() => {

      //@ts-ignore
      window.Intercom('trackEvent', 'page-navigation', {
        name: user.displayName || 'N/A', // Full name
        email: user.email || 'N/A', // Email address
        user_id: user.uid,
        avatar: {
          "type": "avatar",
          "image_url": user.photoURL
        }, // current_user_id
        page: pathname
      })

    })
  
  
  return (
    <Switch>
      <Route path={`${path}/artists/:artistId`} render={props => <Artist {...{uid, pathParams, ...props}}/>}/>
      <Route path={`${path}/genres/:genre`} render={props => <Genre {...{uid, pathParams, ...props}}/>}/>
      <Route path={path} render={props => <Main {...{uid, pathParams, ...props, ...rest}}/>}/>
    </Switch>
  )
}