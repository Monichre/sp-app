import React, { useEffect, useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import { TPathParams, insightLink } from '../shared/functions';
import { useInsightsDash } from '../../../../../types';
import { notLargeQuery, largeQuery } from '../../../../../shared/media';
import styled from 'styled-components';
import { VerticalSpacer } from '../../../../../shared/VerticalSpacer';
import { ArtistsChartBlock } from '../shared/ArtistsChart';
import { BlockTitle, BlockTitleMore } from '../shared/BlockTitle';
import { GenresChartBlock } from '../shared/GenresChart';
import { TimeseriesChart } from '../shared/TimeseriesChart';
import { suspensefulHook } from '../../../../../lib/suspensefulHook';
import { FeaturedArtists } from './FeaturedArtists';
import ReactTooltip from 'react-tooltip'
import { AchievementsState } from '../../Authed';
import { FirstPlaceBadge, SecondPlaceBadge, ThirdPlaceBadge } from '../../../../Components/Badge'
import { UserAchievementsList } from '../../../../Components/UserAchievementsList'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 30px 0; 

  .isTopListener {
    border: 1px solid #64d6ee;
  }
  ${notLargeQuery`
    flex-direction: column;
  `}
  ${largeQuery`
    & > div {
      flex: 1;
      margin-left: 2rem;
    }
    & > div:nth-child(1) {
      margin-left: 0;
    }
  `}
`




const determineAchievements = (artists: any[], userId: string) => {
 
  const isUser = (userId: string, achievementHolder: any) => achievementHolder && achievementHolder.user.uid === userId

  // AchievementData
  const updatedAchievements: AchievementsState = {
    1: {
      achievement: 'Top Listener',
      artists: [],
      Badge: <FirstPlaceBadge />
    },
    2: {
      achievement: 'Second Top Listener',
      artists: [],
      Badge: <SecondPlaceBadge />
    },
    3: {
      achievement: 'Third Top Listener',
      artists: [],
      Badge: <ThirdPlaceBadge />
    }
 }
  
  artists.forEach(artist => {
    const { topListeners  } = artist

    topListeners.forEach((listener: any, i: any) => {
      let itIs: boolean = isUser(userId, listener)

      // @ts-ignore
      if (itIs) { updatedAchievements[i + 1].artists.push(artist) }

    })
  })

  return {
    updatedAchievements
  }

}

export const Overview: React.SFC<RouteComponentProps & { uid: string, pathParams: TPathParams }> = ({ uid, pathParams }) => {
  const {
    insightsDash: {
      [pathParams.timeScope]: {
        timeSeries,
        [pathParams.perspective]: { artists, genres }
      }
    }
  } = suspensefulHook(useInsightsDash({ variables: { uid }, suspend: true, pollInterval: 10000 }))
  
  const theArtists = artists.map(({ artist }) => artist)
  const { updatedAchievements } = determineAchievements(theArtists, uid)

  console.log('TCL: updatedAchievements', updatedAchievements)
  console.count('Overview Render: ')
  
  return <>
    <TimeseriesChart {...{ timeSeries, showOnly: pathParams.perspective }} />
    <Row>
      <UserAchievementsList userAchievements={updatedAchievements} />
      <ArtistsChartBlock {...{ artists, pathParams }} userId={uid}>
        <BlockTitle to={`${insightLink(pathParams)}/artists`}>Top Artists <BlockTitleMore>see all</BlockTitleMore></BlockTitle>
      </ArtistsChartBlock>
      <GenresChartBlock {...{ genres, pathParams }}>
        <BlockTitle to={`${insightLink(pathParams)}/genres`}>Top Genres <BlockTitleMore>see all</BlockTitleMore></BlockTitle>
      </GenresChartBlock>
    </Row>
    <Row>
      <BlockTitle>Emerging Artists: Staff Picks</BlockTitle>
    </Row>
    <Row>
      <FeaturedArtists />
    </Row>
    <VerticalSpacer height='100px' />
    <ReactTooltip place="top" type="dark" effect="float" />
  </>
}
