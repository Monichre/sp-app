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



export const Overview: React.SFC<RouteComponentProps & { uid: string, pathParams: TPathParams }> = ({ uid, pathParams }) => {
  const {
    insightsDash: {
      [pathParams.timeScope]: {
        timeSeries,
        [pathParams.perspective]: { artists, genres }
      }
    }
  } = suspensefulHook(useInsightsDash({ variables: { uid }, suspend: true, pollInterval: 10000 }))

  const normalizetimeScopeMap: any = {
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    life: 'Life Time',

  }
  const { timeScope, perspective }: any = pathParams
  const translatedPerspective: string = perspective === 'personal' ? 'Your' : 'Everyone'


  console.count('Overview Render: ')

  return <>
    <TimeseriesChart {...{ timeSeries, showOnly: pathParams.perspective }} />
    <Row>
      
      <ArtistsChartBlock {...{ artists, pathParams }} userId={uid}>
        <BlockTitle to={`${insightLink(pathParams)}/artists`}>{translatedPerspective} Top Artists {normalizetimeScopeMap[timeScope]} <BlockTitleMore>see all</BlockTitleMore></BlockTitle>
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
