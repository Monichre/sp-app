import React from 'react';
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { TPathParams } from './shared';
import { StatPage } from './shared';
import { InsightsBackLink } from './shared/InsightsBackLink';
import { useInsightsArtistStats, ArtistFragmentFragment, useGetArtistAchievementHolders } from '../../../../types';
import { SpotifyLogoLink } from '../../../../shared/SpotifyLogoLink/SpotifyLogoLink';
import { TimeseriesChart } from './shared/TimeseriesChart';
import { ArtistTopListeners, scopeTheListeners, TopListenerAcheivementCard } from './ArtistTopListeners'
import { suspensefulHook } from '../../../../lib/suspensefulHook';
import { AvatarBg, firstPlaceBadge, IconText } from '../../../Components/Elements';
import { List, Card, Avatar, Badge, Tag, Progress } from 'antd';
import { Box, Flex} from 'rebass';
import { AchievementHoldersList } from '../../../Components/ArtistAchievementHolders/AchievementHoldersList';
import { ListStyle } from '../../../Components/ListStyle';
import { hrsAndMins } from '../../../../lib/durationFormats';
import 'antd/es/badge/style/css'
import 'antd/es/tag/style/css'
import 'antd/es/list/style/css'
import 'antd/es/avatar/style/css'
import 'antd/es/progress/style/css'
import { badgeMap } from './shared/ArtistsChart/TopListenerYAxis';


const ArtistBannerDiv = styled.div<{ backgroundUrl: string }>`
  display: flex;
  align-items: center;
  background: linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7) ), url("${({ backgroundUrl }) => backgroundUrl}");
  background-size: cover;
  background-position: center center;
  min-height: 12rem;
  margin: 1rem -1rem 0rem -1rem;
  padding: 0rem 1rem 0rem 1rem;
  @media (max-width: 800px) {
    margin-top: 0;
    min-height: 6rem;
  }
  & > * {
    margin-right: 2rem;
  }
`

const ArtistTitle = styled.div`
  font-weight: 500;
  font-size: 3rem;
  color: #fff;
  @media (max-width: 800px) {
    font-size: 1.5rem;
  }
`

const ArtistBanner: React.SFC<{ artist: ArtistFragmentFragment, children: any }> = ({ artist, children }) => {
  const { name, images, external_urls: { spotify }, topListeners }: any = artist

  const backgroundUrl = images[0] && images[0].url
  return (
    <ArtistBannerDiv {...{ backgroundUrl }}>
      <InsightsBackLink />
      <ArtistTitle>{name}</ArtistTitle>
      <SpotifyLogoLink href={spotify} size='35px' />

      {children}

    </ArtistBannerDiv>
  )
}

export const Artist: React.SFC<RouteComponentProps<{ artistId: string }> & { uid: string, pathParams: TPathParams }> =
  ({ uid, history, match: { path, params: { artistId } }, pathParams }) => {

    const { insightsArtistStats: stats } = suspensefulHook(useInsightsArtistStats({ variables: { uid, artistId }, suspend: true }))
    // const 

    const { artist, [pathParams.timeScope]: { timeseries: timeSeries } } = stats

    const { getArtistAchievementHolders }: any = suspensefulHook(useGetArtistAchievementHolders({ variables: { perspectiveUID: 'global', artistId }, suspend: true }))
    const { day, week, month, life } = getArtistAchievementHolders
    console.log('TCL: life', life)
    const data = [{ title: 'Top Listeners Today', ...day }, { title: 'Top Listeners This Week', ...week }, { title: 'Top Listeners This Month', ...month }].filter((timePeriod: any) => {
      const { first, second, third } = timePeriod
      return (first.user !== null)
    })


    return (
      <StatPage {...{ stats, history, path, pathParams }}>
        <ArtistBanner {...{ artist }}>

          {Object.keys(life).map((place: any) => {
            const listener = life[place]

            if(listener.user) {
              const { user } = listener
              const { hrs, mins } = hrsAndMins(listener.total)
              const hours = hrs ? `${hrs} hours & ` : ''
              const minutes = mins ? `${mins} mins` : ''
              const ttl = `${hours}${minutes}`

              return (
                <Box mt={45}>
                  
                <Badge count={<img src={badgeMap[place]}  style={{
                    height: '30px',
                    width: '30px',
                    zIndex: 2,
                    left: '40%'
                  }} />}>
                    <AvatarBg artistPage style={{
                      marginTop: '0.5rem'
                    }}>
                      <img src={user.photoURL} />
                    </AvatarBg>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <h4 style={{ color: '#fff', position: 'relative', zIndex: 2, textTransform: 'capitalize' }}>{place} place all time top listener <br /> {user.displayName}</h4>
                    <p style={{ position: 'relative', zIndex: 2 }}><b>{ttl}</b></p>
                  </Badge>
                </Box>
              )
            } else {
              return null
            }

          })}
        </ArtistBanner>

        <TimeseriesChart {...{ timeSeries }} />

        <Box my={40}>
          <ListStyle>
            <List id='artistTopListeners' dataSource={data} renderItem={item => {
              console.log('TCL: item', item)

              return (
                <List.Item>
                  <Box style={{ width: '100%', backgroundColor: 'rgba(216,216,216,.025)', padding: '20px', borderRadius: '12px' }}>
                    <h4 style={{ color: '#fff' }}>{item.title}</h4>
                    <List
                      itemLayout="vertical"
                      size="large"
                      dataSource={[item.first, item.second, item.third].filter((item: any) => item.user !== null)}
                      renderItem={(topListener, index) => {
                        const { user } = topListener
                        const { hrs, mins } = hrsAndMins(topListener.total)
                        const hours = hrs ? `${hrs} hours & ` : ''
                        const minutes = mins ? `${mins} mins` : ''
                        const ttl = `${hours}${minutes}`

                        console.log('TCL: topListener', topListener)
                        return (
                          <List.Item
                            key={`${item.title}_${index}`}

                          >
                            <List.Item.Meta
                              avatar={
                                <Badge count={<img src={badgeMap[index]} style={{
                                  height: '25px',
                                  width: '25px',
                                  zIndex: 2,
                                  // left: '100%'
                                }} />}>
                                  <AvatarBg><Avatar src={user.photoURL} /></AvatarBg>
                                  {/* <AvatarBg  style={{
                                    marginTop: '0.5rem'
                                  }}>
                                    <img src={user.photoURL} />
                                  </AvatarBg> */}
                                </Badge>
                              }
                              title={user.displayName}
                              description={ttl}
                            />

                            <Progress percent={mins * 10} strokeColor={{
                              '0%': '#108ee9',
                              '100%': '#87d068',
                            }} />

                          </List.Item>
                        )
                      }}
                    />
                  </Box>
                </List.Item>
              )
            }} />
          </ListStyle>


          {/* <ArtistTopListeners>
          {month && month.first && month.first.user ? <TopListenerAcheivementCard topListenerData={month.first} title='Monthly Top Listener' /> : null}

          {week && week.first && week.first.user ? <TopListenerAcheivementCard topListenerData={week.first} title='weekly Top Listener' /> : null}

          {day && day.first && day.first.user ? <TopListenerAcheivementCard topListenerData={day.first} title='daily Top Listener' /> : null}
        </ArtistTopListeners> */}

        </Box>

      </StatPage>
    )
  }
// TARGET=test CONFIG=test yarn build && TARGET=test CONFIG=test yarn deploy