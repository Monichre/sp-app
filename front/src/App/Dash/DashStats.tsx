import React from 'react';
import styled from 'styled-components'
import { RouteComponentProps, Switch, Route } from 'react-router';
import moment from 'moment'
import { useDashStats } from '../../types';
import { Loading } from '../../comp/Loading';

// we should probably be applying this at a higher level in the DOM
const Container = styled.div`
  padding: 0 0.5rem;
`
const Block = styled.div`
  padding: 0.5rem;
  margin: 0.5rem 0;
`

const EvenRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  & > * {
    flex: 1
  }
`

const NavSelect = styled.select`
  width: 100%;
  color: #FFF !important;
  background-color: #666;
`

type Artist = {
  name: string
  playDurationMs: number
}

const hrsAndMins = (durationMs: number) => {
  const d = moment.duration(durationMs)
  return {
    hrs: d.hours(),
    mins: d.minutes(),
  }
}

const ArtistRow: React.SFC<{artist: Artist}> = ({artist: {name, playDurationMs}}) => {
  const { hrs, mins } = hrsAndMins(playDurationMs)
  return (<div data-test='artist-row'>
    <h5 data-test='artist-row-name'>{name}</h5>
    <p>
      <span data-test='artist-row-hours'>{hrs}</span> hrs
      <span data-test='artist-row-minutes'>{mins}</span> mins
    </p>
  </div>
)}

const TopArtists: React.SFC<{global: Artist[], user: Artist[]}> = ({global, user}) => (
  <EvenRow>
    <div data-test='top-artists-global'>
      <h3>On Soundpruf</h3>
      { global.map((artist, key) => <ArtistRow {...{key, artist}}/>)}
    </div>
    <div data-test='top-artists-personal'>
      <h3>Your Top</h3>
      { user.map((artist, key) => <ArtistRow {...{key, artist}}/>)}
    </div>
  </EvenRow>
)

export const DashStats: React.SFC<RouteComponentProps & {uid: string}> = ({uid, history}) => {
  const navTo = (path: string) => history.push(path)
  const { data } = useDashStats({variables: {uid}, suspend: true})
  if (!data || !data.dashStats) { return <Loading/>}
  const { dashStats } = data
  console.log('dashStats', dashStats)
  return (
    <Container>
      <Block>
        <h2>Top Artists</h2>
        <NavSelect data-test='top-artists-period-select' onChange={e => navTo(e.target.value)}>
          <option value='/'>This Week</option>
          <option value='/by-month'>This Month</option>
          <option value='/life' data-test='top-artists-period-select-life'>Lifetime</option>
        </NavSelect>
        <Switch>
          <Route path='/life' render={(props) => <TopArtists global={dashStats.life.global} user={dashStats.life.user}/>}/>
          <Route path='/by-month' render={(props) => <TopArtists global={dashStats.month.global} user={dashStats.month.user}/>}/>
          <Route path='/' render={(props) => <TopArtists global={dashStats.week.global} user={dashStats.week.user}/>}/>
        </Switch>
      </Block>

    </Container>
  )
}