import React, { useEffect, useContext, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import { TPathParams, insightLink } from '../shared/functions';
import { useInsightsDash, useGetTopArtistAchievementHolders } from '../../../../../types';
import { notLargeQuery, largeQuery } from '../../../../../shared/media';
import styled from 'styled-components';
import { VerticalSpacer } from '../../../../../shared/VerticalSpacer';
import { ArtistsChartBlock } from '../shared/ArtistsChart';
import { BlockTitle, BlockTitleMore, SeeAllLink, SeeAllLinkInner, SeeAllIcon } from '../shared/BlockTitle';
import { GenresChartBlock } from '../shared/GenresChart';
import { TimeseriesChart } from '../shared/TimeseriesChart';
import { suspensefulHook } from '../../../../../lib/suspensefulHook';
import { FeaturedArtists } from './FeaturedArtists';
import ReactTooltip from 'react-tooltip'
import { AchievementHoverSummary } from '../../../../Components/AchievementHoverSummary.tsx';
import { Tooltip } from 'antd';

import { Box } from 'rebass';


const TotalNumberOfUsers = styled.p`
  margin-bottom: -21px;
  text-align: right;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 30px 0; 

  h1 {
    color: #fff;
  }
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

export const normalizeTimeScope = (pathParams: any) => {
  const normalizetimeScopeMap: any = {
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    life: 'Life Time',
    lifetime: 'Life Time',

  }
  const { timeScope, perspective }: any = pathParams

  const t = normalizetimeScopeMap[timeScope]
  console.log('TCL: normalizeTimeScope -> t', t)
  return t
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

  console.log('TCL: genres', genres)
  console.log('TCL: artists', artists)
  const { timeScope, perspective }: any = pathParams
  console.log('TCL: timeScope', timeScope)
  const translatedPerspective: string = perspective === 'personal' ? 'Your' : 'Everyone'
  const period = normalizeTimeScope(pathParams)

  const genreContentSummary = `We're currently building out new features for platform genre leaders`

  const artistContentSummary = `Introducing "Artist Leaders!" Think you're probably the biggest listener on Soundpruf to Tyler, The Creator? Or Lizzo? Maybe Yam Haus? Now you can prove it. If you are currently in 1st, 2nd or 3rd place for lifetime listening for an artist, you'll now see a badge indicating that to the right of the artist names in all Top lists. If you don't have a lifetime leader badge for that artist, you can see who does! You can also view your achievements per time perspective, including week and month, by clicking the links to the left and exploring the slide-out panel. Just remember, you never know when you might lose first place!`


  console.count('Overview Render: ')

  const artistCount = artists.length === 3 ? 3 : null

  return <>
    {translatedPerspective == "Everyone" ? <TotalNumberOfUsers>451 SoundPruf Users</TotalNumberOfUsers> : null}
    <Row>
      <AchievementHoverSummary content={artistContentSummary} userId={uid} achievementsGraph period={period}>

        <Tooltip title="See All" placement="topRight">
          <SeeAllLink to={`${insightLink(pathParams)}/artists`}>
            <SeeAllLinkInner>
              <SeeAllIcon />
            </SeeAllLinkInner>
          </SeeAllLink>


          <ArtistsChartBlock {...{ artists, pathParams }} userId={uid}>
            <BlockTitle>
              {translatedPerspective} Top {artistCount} Artists {period}
            </BlockTitle>
          </ArtistsChartBlock>
        </Tooltip>
      </AchievementHoverSummary>


      <AchievementHoverSummary genres content={genreContentSummary} userId={uid}>
        <Tooltip title="See All" placement="topRight">
          <SeeAllLink to={`${insightLink(pathParams)}/genres`}>
            <SeeAllLinkInner>
              <SeeAllIcon />
            </SeeAllLinkInner>
          </SeeAllLink>

          <GenresChartBlock {...{ genres, pathParams }}>
            <BlockTitle>{translatedPerspective} Top Genres {period}</BlockTitle>
          </GenresChartBlock>
        </Tooltip>
      </AchievementHoverSummary>
    </Row>
    <Box style={{
      backgroundColor: 'rgba(216,216,216,.055)', borderRadius: '12px',
      padding: '2em',
      margin: '30px auto'
    }}>
      <TimeseriesChart {...{ timeSeries, showOnly: pathParams.perspective }} />
    </Box>
    <Box style={{
      backgroundColor: 'rgba(216,216,216,.055)', borderRadius: '12px',
      padding: '2em',
      margin: '30px auto'
    }}>
      <BlockTitle>Emerging Artists: Staff Picks</BlockTitle>

      <Row>
        <FeaturedArtists />
      </Row>
    </Box>

    <VerticalSpacer height='100px' />
    <ReactTooltip place="top" type="dark" effect="float" />
  </>
}
