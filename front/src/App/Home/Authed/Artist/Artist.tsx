import React from 'react';
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { useArtistStats, ArtistStatsGlobal, ArtistStatsPersonal } from '../../../../types';
import { BasicUser } from '../../../FirebaseContext';
import { Previous } from 'grommet-icons';
import { SpotifyLogoLink } from '../../../../shared/SpotifyLogoLink/SpotifyLogoLink';
import { ResponsiveContainer, LineChart, XAxis, Line, CartesianGrid, YAxis, Label } from 'recharts'

const statToHours = ({period, playDurationMs}: ArtistStatsPersonal | ArtistStatsGlobal) => ({
  period,
  playDurationMs: playDurationMs / (1000 * 60 * 60)
})

const BlockTitle = styled.div`
  display: flex;
  align-items: flex-end;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #64d6ee;
  margin: 1rem 0;

  & > * {
    margin-right: 0.5rem;
  }

`

const ArtistStatsOverTime: React.SFC<{title: string, subtitle:string, personal: ArtistStatsPersonal[], global: ArtistStatsGlobal[]}> =
({title, subtitle, personal, global}) => {
  const personalHours = personal.map(statToHours)
  const globalHours = global.map(statToHours)
  const data = personalHours.map((stat, i) => ({
    period: stat.period,
    personal: stat.playDurationMs,
    global: globalHours[i].playDurationMs
  }))
  return (
    <div>
      <BlockTitle>{title} | {subtitle}</BlockTitle>
      <ResponsiveContainer width='100%' height={300}>
        
      <LineChart data={data}>
        <XAxis dataKey="period" stroke='#CCC'/>
        <YAxis yAxisId='left' stroke='#CCC'>
          <Label position='insideTopLeft' angle={90} offset={10} stroke='#64d6ee' >you</Label>
        </YAxis>
        <YAxis yAxisId='right' stroke='#CCC' orientation='right'>
          <Label position='insideBottomRight' angle={90} offset={10} stroke='#43a4cc' strokeOpacity={0.5}>world</Label>
        </YAxis>
        <CartesianGrid stroke='#CCC'/>
        <Line type='step' dataKey='global' stroke='#43a4cc' strokeWidth={8} strokeOpacity={0.5} yAxisId='right'/>
        <Line type='step' dataKey='personal' stroke='#64d6ee' strokeWidth={2} strokeOpacity={1} yAxisId='left'/>
      </LineChart>
      </ResponsiveContainer>
    </div>
  )
}


const ArtistBanner = styled.div<{src: string}>`
  display: flex;
  align-items: start;
  background: linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url("${({src}) => src}");
  background-size: cover;
  background-position: center center;
  min-height: 24rem;
  margin: -1rem -1rem -16rem -1rem;
  padding: 3rem 1rem 1rem 1rem;
  & > * {
    margin-right: 2rem;
  }
`

const ArtistTitle = styled.div`
  font-weight: 500;
  font-size: 3rem;
  @media (max-width: 800px) {
    font-size: 2rem;
  }
`

const Back = styled(Previous)`
  cursor: pointer;
`
const BackLink: React.SFC = () =>
  <Back onClick={() => window.history.back()} color='white' size='3rem'/>

export const Artist: React.SFC<RouteComponentProps<{id: string}> & {user: BasicUser}> = ({user: { uid }, match: { params: { id }}}) => {
  const artistStats = useArtistStats({ variables: { id, uid }, suspend: true})
  if (!artistStats || !artistStats.data || !artistStats.data.artistStats) { return <div>Error!</div> }
  const { artist: { name, images, external_urls: { spotify } }, past30d, past12w} = artistStats.data.artistStats
  const imgUrl = images && images[0] && images[0].url
  console.log('artistStats', artistStats.data.artistStats)
  return (
    <div>
      <ArtistBanner src={imgUrl}>
        <BackLink/>
        <ArtistTitle>{name}</ArtistTitle>
        <SpotifyLogoLink href={spotify}/>
      </ArtistBanner>
      <ArtistStatsOverTime title='Daily Hours' subtitle='Past 30 Days' {...past30d}/>
      <ArtistStatsOverTime title='Weekly Hours' subtitle='Past 12 Weeks' {...past12w}/>
    </div>
  )
}
