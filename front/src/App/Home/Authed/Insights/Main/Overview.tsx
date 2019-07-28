import React from 'react';
import { RouteComponentProps } from 'react-router';
import { TPathParams, insightLink } from '../shared/functions';
import { useInsightsDash, ArtistFragmentTopListeners } from '../../../../../types';
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


// type AchievementsObject = {
//   1: {

//   },
//   2: {

//   },
//   3: {

//   }
// }

// type AchievementObject = {
//   achievementTitle: string,
//   artists: 
// }


const FirstPlaceBadge: React.SFC = () => <img src='/icons/first-currentUser.png' />
const SecondPlaceBadge: React.SFC = () => <img src='/icons/second-currentUser.png' />
const ThirdPlaceBadge: React.SFC = () => <img src='/icons/third.svg' />

const determineAchievements = (artists: any[], userId: string) => {
 
  const isUser = (userId: string, achievementHolder: any) => achievementHolder && achievementHolder.user.uid === userId

 const achievements: any = {
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

    topListeners.forEach((listener: any, i: number) => {
      let itIs: boolean = isUser(userId, listener)

      if (itIs) { achievements[i + 1].artists.push(artist) }

    })
  })

  return {
    achievements
  }

}

export const Overview: React.SFC<RouteComponentProps & { uid: string, pathParams: TPathParams, setUserAchievements: Function }> = ({ uid, pathParams, setUserAchievements }) => {
  const {
    insightsDash: {
      [pathParams.timeScope]: {
        timeSeries,
        [pathParams.perspective]: { artists, genres }
      }
    }
  } = suspensefulHook(useInsightsDash({ variables: { uid }, suspend: true, pollInterval: 10000 }))

    
  const theArtists = artists.map(({artist}) =>  artist)
  const { achievements } = determineAchievements(theArtists, uid)
  console.log('TCL: achievements', achievements)

  // setUserAchievements(achievements)


  return <>
    <TimeseriesChart {...{ timeSeries, showOnly: pathParams.perspective }} />
    <Row>
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
