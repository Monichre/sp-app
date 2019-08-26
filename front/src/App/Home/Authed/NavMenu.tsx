import React from 'react';
import styled from 'styled-components'
import { NavLink } from 'react-router-dom';
import { LineChart, History, User } from 'grommet-icons'
import { largeQuery, notLargeQuery, BRAND_COLOR, BRAND_PERSONAL_COLOR, Large } from '../../../shared/media';
import {useInsightsDash, useInsightsArtists} from '../../../types'
import { LogoHorizontal } from '../../../shared/Logo';
import { UserAchievementsList } from '../../Components/UserAchievementsList'
import { suspensefulHook } from '../../../lib/suspensefulHook';
import Moment from 'react-moment';
import { AvatarBg } from '../../Components/Elements';




export const NavMenuView = styled.div`
background-color: #030616;
z-index: 20;
}
`

const NavLabel = styled.div`
`

const NavPrimaryLink = styled(NavLink)`
text-decoration: none;
&:hover {
  color: ${BRAND_COLOR};
  svg {
    stroke: ${BRAND_COLOR};
  }
}
&.active {
  background-color: rgba(216, 216, 216, .05);

  color: ${BRAND_COLOR};

  svg {
    stroke: ${BRAND_COLOR};
  }
}
${largeQuery`
  text-align: right;
  width: 100%;
  padding: 1.5rem 2rem;
  font-size: 1.25rem;
  flex-direction: row-reverse;
  align-items: center;
  display: flex;

  &.active {
    border-right: 0.5rem solid ${BRAND_COLOR};
    padding-right: 1.5rem;
  }

  svg {
    margin-left: 0.5rem;
  }
`}
${notLargeQuery`
  text-align: center;
  padding: 1rem 0rem;
  flex: 1;
  flex-direction: column;
  text-transform: uppercase;

  &.active {
    ${NavLabel} {
      display: block;
    }
    border-top: 0.5rem solid ${BRAND_PERSONAL_COLOR};
    padding-top: 0.5rem;
  }
  svg {
    margin-bottom: 0.5rem;
  }

  ${NavLabel} {
    display: none;
  }

`}
`

const FillSpace = styled.div`
  flex: 100;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  align-items: center;
`

const LastUpdateDiv = styled.div`
  padding: 1rem;
  color: #888;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: center;
  font-size: 0.8rem;
`
const LastUpdate: React.SFC<{lastUpdate: string}> = ({lastUpdate}) =>
  <LastUpdateDiv>
    <div>last updated</div>
    <div><Moment fromNow>{lastUpdate}</Moment></div>
  </LastUpdateDiv>

const HarvestingNoticeDiv = styled.div`
margin: 2rem 0rem;
padding: 1rem;
background-color: #AAA;
color: #030616;
`

const AvatarLink = styled(NavPrimaryLink)`
        border-top: 1px solid rgba(255,255,255,.1);
    border-bottom: 1px solid rgba(255,255,255,.1);
    background-color: rgba(216,216,216,.05);
`

const HarvestingNotice: React.SFC = () =>
  <HarvestingNoticeDiv>
    Watch your stats grow as we complete your initial harvest.
  </HarvestingNoticeDiv>

export const NavMenu: React.SFC<{ initialHarvestComplete: boolean, lastUpdate: string, user: any, history?: any, match?: any}> = ({ initialHarvestComplete, lastUpdate, user, ...rest}) => {
const {uid} = user
const { history, match} = rest
const { location: { pathname } } = history
const { path, params } = match
const focus = pathname.split('/').slice(5,99).join('/')
console.log('TCL: focus', focus)
const pathParams = { focus, ...params }


  // const {insightsDash: usersTopArtistByPeriodData} = suspensefulHook(useInsightsDash({ variables: { uid }, suspend: true }))
  
  const { insightsArtists: usersTopArtistByPeriodData } = suspensefulHook(useInsightsArtists({ variables: { uid }, suspend: true }))
  console.log('TCL: usersTopArtistByPeriodData', usersTopArtistByPeriodData)
  // [pathParams.timeScope]: {
  //   timeSeries,
  //   [pathParams.perspective]: { artists, genres }
  // }
  // const { [pathParams.timeScope]: { [pathParams.perspective]: artists } }: any = userTopArtistsFull

  
  return (
    <NavMenuView>
      <AvatarLink to='#'>
        <AvatarBg sideNav={true} src={user.photoURL ? user.photoURL : '/icons/headphones.svg'} />
        <NavLabel>{user.displayName ? user.displayName : user.email}</NavLabel>
      </AvatarLink>
      <NavPrimaryLink to='/insights'>
        <LineChart color='white' />
        <NavLabel>Insights</NavLabel>
      </NavPrimaryLink>
      <NavPrimaryLink to='/history'>
        <History color='white' />
        <NavLabel>History</NavLabel>
      </NavPrimaryLink>
      <NavPrimaryLink to='/profile'>
        <User color='white' />
        <NavLabel>Profile</NavLabel>
      </NavPrimaryLink>
      <Large>
        <UserAchievementsList userId={user.uid} usersTopArtistByPeriodData={usersTopArtistByPeriodData}/>
        <FillSpace>
          {!initialHarvestComplete ? <HarvestingNotice /> : <LastUpdate {...{ lastUpdate }} />}
          <LogoHorizontal size={8} />
        </FillSpace>
      </Large>
    </NavMenuView>
  )
}
