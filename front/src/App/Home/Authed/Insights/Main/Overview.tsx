import React, { useEffect, useContext } from 'react';
import { RouteComponentProps } from 'react-router';
import { TPathParams, insightLink } from '../shared/functions';
import { useInsightsDash } from '../../../../../types';
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

  return normalizetimeScopeMap[timeScope]
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

  const { timeScope, perspective }: any = pathParams
  const translatedPerspective: string = perspective === 'personal' ? 'Your' : 'Everyone'
  const period = normalizeTimeScope(pathParams)

  const genreContentSummary = `We're currently building out new features for platform genre leaders`

  const artistContentSummary = `Introducing our new platform artist leaders. These achievements are for those Soundpruf users who have streamed the most of any given artist. View Your Achievements based on the current time perspective to the left.`


  console.count('Overview Render: ')

  const artistCount = artists.length === 3 ? 3 : null

  return <>
    <TimeseriesChart {...{ timeSeries, showOnly: pathParams.perspective }} />
    <Row>
      <AchievementHoverSummary content={artistContentSummary} userId={uid} achievementsGraph period={period}>
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
      </AchievementHoverSummary>


      <AchievementHoverSummary content={genreContentSummary} userId={uid}>
        <SeeAllLink to={`${insightLink(pathParams)}/genres`}>
          <SeeAllLinkInner>
            <SeeAllIcon />
          </SeeAllLinkInner>
        </SeeAllLink>

        <GenresChartBlock {...{ genres, pathParams }}>
          <BlockTitle>Top Genres</BlockTitle>
        </GenresChartBlock>
      </AchievementHoverSummary>

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
