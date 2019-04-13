import React from 'react';
import styled from 'styled-components'
import { DashStatsGlobal } from '../../../../types';
import moment from 'moment'

const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column-gap: 2rem;
  @media (max-width: 600px) {
    grid-template-columns: 100%;
  }

  align-items: start;
`

const Block = styled.div`
  margin-top: 1rem;
`

const hrsAndMins = (durationMs: number) => {
  const d = moment.duration(durationMs)
  return {
    hrs: Math.trunc(d.asHours()),
    mins: d.minutes(),
  }
}

type Artist = {
  name: string
  playDurationMs: number
}

const bgSize = 16;

const ArtistAvatar = styled.div<{src: string}>`
  height: ${bgSize/2}rem;
  width: ${bgSize/2}rem;
  border-radius: ${bgSize/2/2}rem;
  background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${({src}) => src}");
  background-size: cover;
`

const ArtistName = styled.div`
  font-size: ${bgSize/12}rem;
  font-weight: 500;
`

const Artist = styled(NavLink)`
display: flex;
text-decoration: none;
`

const ArtistTime = styled.div`
  display: flex;
  align-items: baseline;
  & > * {
    margin-right: 0.5rem;
  }
`

const ArtistInfo = styled.div`
  margin-top: ${bgSize/16}rem;
  margin-left: -${bgSize/2/2}rem;
`

const MajorValue = styled.div`
  font-weight: 500;
  font-size: 2rem;
`

const MinorValue = styled.div`
font-size: 1.33rem;
font-weight: 500;
color: #64d6ee;
`


const ArtistStatItem: React.SFC<DashStatsGlobal> = ({artist: { id, name, images, external_urls: { spotify } }, playDurationMs}) => {
  const { hrs, mins } = hrsAndMins(playDurationMs)
  const imgUrl = images && images[0] && images[0].url
  return (
    <Artist data-test='artist-row' to={`/artist/${id}`}>
      <ArtistAvatar src={imgUrl}/>
      <ArtistInfo>
        <ArtistName data-test='artist-row-name'>{name}</ArtistName>
        <ArtistTime>
          <MajorValue data-test='artist-row-hours'>{hrs} hrs</MajorValue>
          <MinorValue data-test='artist-row-minutes'>{mins} mins</MinorValue>
        </ArtistTime>
        <SpotifyLogoLink href={spotify}/>
      </ArtistInfo>
    </Artist>
  )
}

const ArtistTimeGrid = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  grid-row-gap: 1rem;
  @media (max-width: 600px) {
    grid-template-columns: 100%;
  }
`

const Title = styled.div`
  text-transform: uppercase;
  font-weight: 500;
  font-size: 1.2rem;
  padding-bottom: 10px;
  margin-bottom: 1rem;
  border-bottom: 1px solid #64d6ee;
`

const TopArtists: React.SFC<{global: DashStatsGlobal[], user: DashStatsGlobal[]}> = ({global, user}) => (
  <TwoColumns>
    <div data-test='top-artists-global'>
      <Title>Soundpruf Artists</Title>
      <ArtistTimeGrid>
      { global.map((stat, key) => <ArtistStatItem {...{key, ...stat}}/>)}
      </ArtistTimeGrid>
    </div>
    <div data-test='top-artists-personal'>
      <Title>Your Artists</Title>
      <ArtistTimeGrid>
      { user.map((stat, key) => <ArtistStatItem {...{key, ...stat}}/>)}
      </ArtistTimeGrid>
    </div>
  </TwoColumns>
)

import { DashStatsWeek, DashStatsMonth, DashStatsLife } from '../../../../types';
import { SpotifyLogoLink } from '../../../SpotifyLogoLink/SpotifyLogoLink';
import { NavLink } from 'react-router-dom';
type DashStatsPeriod = DashStatsWeek | DashStatsMonth | DashStatsLife

export const TopArtistPeriods: React.SFC<{stats: DashStatsPeriod}> = ({stats}) => {
  return (
    <Block>
    <TopArtists global={stats.global} user={stats.user}/>
    </Block>
  )
}