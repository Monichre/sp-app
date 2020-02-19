import React, { useState, useRef } from "react";
import { TPathParams, insightLink, artistLink, navigateTo } from "../functions";
import {
  Link,
  withRouter,
  BrowserRouter,
  RouteComponentProps
} from "react-router-dom";
import { History } from "history";
import { PerspectiveDashArtists } from "../../../../../../types";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Label
} from "recharts";
import {
  BRAND_GLOBAL_COLOR,
  BRAND_PERSONAL_COLOR
} from "../../../../../../shared/media";
import { Comment } from "../Comment";
import max from "ramda/es/max";
import pluck from "ramda/es/pluck";
import reduce from "ramda/es/reduce";
import pipe from "ramda/es/pipe";
import { decimalToHrsMins } from "../../../../../../lib/durationFormats";
import { TopListenerYaxis } from "./TopListenerYAxis";
import { CustomArtistTick } from "./CustomArtistTick";
import { normalizeTimeScope } from "../../Main/Overview";
import { mapSizesToProps } from "../../../../../../lib/mapSizes";
import withSizes from "react-sizes";

export type TickProps = {
  x?: number;
  y?: number;
  offset?: number;
  artist: {
    id: string;
    name: string;
    images: { url: string }[];
    topListeners: {}[];
  };
  userId: string;
  revealTopListener: Function;
  pathParams: TPathParams;
  isMobile: boolean;
};

type UserIdProp = {
  userId: string;
};

const navigateToArtist = (history: History, pathParams: TPathParams) => (
  obj: any
) => {
  if (!obj) {
    return;
  }
  const artistId = obj["activePayload"][0]["payload"]["artist"]["id"];
  console.log("artistId", artistId);
  navigateTo(history, artistLink(pathParams, artistId));
};

const domainMaxBuilder: (
  values: PerspectiveDashArtists[]
) => (maxValue: number) => number = (values: PerspectiveDashArtists[]) => (
  maxValue: number
) =>
  Math.ceil(
    pipe<any[], any[], any>(pluck("group"), reduce(max, -Infinity))(values)
  );

type ChartProps = {
  pathParams: TPathParams;
  artists: PerspectiveDashArtists[];
  height?: any;
  isMobile: boolean;
};

const ArtistsChart: React.SFC<RouteComponentProps &
  ChartProps &
  UserIdProp> = ({
  pathParams,
  artists,
  history,
  height = 70,
  userId,
  isMobile
}) => {
  // console.log('ArtistsChart: isMobile', isMobile)
  // console.count('Artist Chart Render')

  const threeArtists = artists.slice(0, 3);
  const yAxisArtistWidth = isMobile ? 50 : 150;
  const yAxisAchievementsWidth = isMobile ? 50 : 75;

  return (
    <ResponsiveContainer width="100%" height={height * artists.length + 100}>
      <BarChart
        layout="vertical"
        data={threeArtists}
        onClick={navigateToArtist(history, pathParams)}
      >
        <XAxis
          height={30}
          type="number"
          stroke="#fff"
          orientation="top"
          xAxisId="top"
          tickFormatter={decimalToHrsMins}
          domain={[0, domainMaxBuilder(artists)]}
        >
          <Label position="insideTopLeft" dy={-2} offset={0} stroke="#fff">
            hours
          </Label>
        </XAxis>

        <YAxis
          width={yAxisArtistWidth}
          yAxisId="left"
          orientation="left"
          type="category"
          stroke={BRAND_PERSONAL_COLOR}
          interval={0}
          tick={({ payload, ...props }) => {
            console.log("TCL: payload", payload);
            return (
              <CustomArtistTick
                {...props}
                pathParams={pathParams}
                artist={artists[payload.value].artist}
              />
            );
          }}
        />

        <YAxis
          width={yAxisAchievementsWidth}
          yAxisId="right"
          orientation="right"
          stroke={BRAND_PERSONAL_COLOR}
          type="category"
          interval={0}
          tick={({ payload, ...props }) => (
            <TopListenerYaxis
              {...props}
              pathParams={pathParams}
              artist={artists[payload.value].artist}
              totalTimeListened={artists[payload.value].personal}
              groupScore={artists[payload.value].group}
              userId={userId}
            />
          )}
        >
          <Label
            position="insideBottomRight"
            dy={4}
            offset={0}
            stroke="#fff"
          >{`Platform Leaders ${normalizeTimeScope(pathParams)}`}</Label>
        </YAxis>

        <Bar
          dataKey="personal"
          fill={BRAND_PERSONAL_COLOR}
          xAxisId="top"
          yAxisId="left"
          barSize={5}
          cursor="pointer"
        />
        <Bar
          dataKey="group"
          fill={BRAND_GLOBAL_COLOR}
          xAxisId="top"
          yAxisId="left"
          barSize={5}
          cursor="pointer"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const ArtistsChartWithRouter = withRouter(ArtistsChart);

const ChartBlock: React.SFC<
  | ({
      pathParams: TPathParams;
      artists: PerspectiveDashArtists[];
      height?: any;
      isMobile: boolean;
    } & UserIdProp)
  | any
> = ({ children, isMobile, ...params }) => {
  console.log("TCL: params", params);
  console.log("TCL: isMobile", isMobile);

  return (
    <div>
      {children}
      {params.artists.length > 0 ? (
        <ArtistsChartWithRouter {...params} {...{ isMobile }} />
      ) : (
        <Comment>
          I don't see any artists for you here. Have you{" "}
          <a target="new" href="http://open.spotify.com">
            listened to Spotify lately?
          </a>
        </Comment>
      )}
    </div>
  );
};

export const ArtistsChartBlock: any = withSizes(mapSizesToProps)(ChartBlock);
