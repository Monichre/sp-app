import React from "react";
import usePortal from "react-useportal";

import { RouteComponentProps } from "react-router";
import { TPathParams, insightLink } from "../shared/functions";
import { useInsightsDash } from "../../../../../types";
import { notLargeQuery, largeQuery } from "../../../../../shared/media";
import styled from "styled-components";
import { VerticalSpacer } from "../../../../../shared/VerticalSpacer";
import { ArtistsChartBlock } from "../shared/ArtistsChart";
import {
  BlockTitle,
  SeeAllLink,
  SeeAllLinkInner,
  SeeAllIcon
} from "../shared/BlockTitle";
import { GenresChartBlock } from "../shared/GenresChart";
import { TimeseriesChart } from "../shared/TimeseriesChart";
import { suspensefulHook } from "../../../../../lib/suspensefulHook";
import { FeaturedArtists } from "./FeaturedArtists";
import ReactTooltip from "react-tooltip";
import { AchievementHoverSummary } from "../../../../Components/AchievementHoverSummary.tsx";
import { Tooltip } from "antd";

import { Box } from "rebass";
import { TopFiveTimePeriod } from "../../../../Components/TopFiveTimePeriod/TopFiveTimePeriod";
import { UserAchievementContext } from "../../Authed";
import { Button } from "../../../../Components/Button/Button";

const TotalNumberOfUsers = styled.p`
  margin-top: 30px;
  margin-bottom: -51px;
  text-align: right;
`;

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
`;

export const ShareButton = styled.div`
  background: pink;
  height: 20px;
  max-width: 124px;
  position: relative;
`;

export const normalizeTimeScope = (pathParams: any) => {
  const normalizetimeScopeMap: any = {
    thisWeek: "This Week",
    thisMonth: "This Month",
    thisYear: "This Year",
    life: "Life Time",
    lifetime: "Life Time"
  };
  const { timeScope, perspective }: any = pathParams;

  const t = normalizetimeScopeMap[timeScope];
  return t;
};

export const Overview: React.SFC<RouteComponentProps & {
  uid: string;
  pathParams: TPathParams;
}> = ({ uid, pathParams }) => {
  const {
    insightsDash: {
      [pathParams.timeScope]: {
        timeSeries,
        [pathParams.perspective]: { artists, genres }
      }
    }
  } = suspensefulHook(
    useInsightsDash({ variables: { uid }, suspend: true, pollInterval: 10000 })
  );

  const { timeScope, perspective }: any = pathParams;

  const translatedPerspective: string =
    perspective === "personal" ? "Your" : "Everyone";
  const period = normalizeTimeScope(pathParams);

  const genreContentSummary = `We're currently building out new features for platform genre leaders`;
  const artistContentSummary = `Introducing "Artist Leaders!" Think you're probably the biggest listener on Soundpruf to Tyler, The Creator? Or Lizzo? Maybe Yam Haus? Now you can prove it. If you are currently in 1st, 2nd or 3rd place for lifetime listening for an artist, you'll now see a badge indicating that to the right of the artist names in all Top lists. If you don't have a lifetime leader badge for that artist, you can see who does! You can also view your achievements per time perspective, including week and month, by clicking the links to the left and exploring the slide-out panel. Just remember, you never know when you might lose first place!`;
  const artistCount = artists.length === 3 ? 3 : null;
  const { openPortal, closePortal, isOpen, Portal } = usePortal();

  return (
    <>
      {/* Gets total users when perspective is Everyone. Currently Static Data */}
      {translatedPerspective == "Everyone" ? (
        <TotalNumberOfUsers>Everyone: 460 people</TotalNumberOfUsers>
      ) : null}
      {isOpen && (
        <Portal>
          <TopFiveTimePeriod
            period={period.replace("This ", "").replace(" Time", "")}
            toggle={closePortal}
            artists={artists}
          />
        </Portal>
      )}

      <Row>
        <AchievementHoverSummary
          content={artistContentSummary}
          userId={uid}
          achievementsGraph
          period={period}
        >
          <Tooltip title="See All" placement="topRight">
            <SeeAllLink to={`${insightLink(pathParams)}/artists`}>
              <SeeAllLinkInner>
                <SeeAllIcon />
              </SeeAllLinkInner>
            </SeeAllLink>

            <ArtistsChartBlock {...{ artists, pathParams }} userId={uid}>
              <BlockTitle>
                <p style={{ padding: "0 10px 0 0", margin: "0" }}>
                  {translatedPerspective} Top {artistCount} Artists {period}{" "}
                </p>
                <Button
                  ghost
                  onClick={(e: any) => openPortal(e)}
                  shape="round"
                  style={{ marginLeft: "auto" }}
                >
                  Share
                </Button>
              </BlockTitle>
            </ArtistsChartBlock>
          </Tooltip>
        </AchievementHoverSummary>

        <AchievementHoverSummary
          genres
          content={genreContentSummary}
          userId={uid}
        >
          <Tooltip title="See All" placement="topRight">
            <SeeAllLink to={`${insightLink(pathParams)}/genres`}>
              <SeeAllLinkInner>
                <SeeAllIcon />
              </SeeAllLinkInner>
            </SeeAllLink>

            <GenresChartBlock {...{ genres, pathParams }}>
              <BlockTitle>
                {translatedPerspective} Top Genres {period}
              </BlockTitle>
            </GenresChartBlock>
          </Tooltip>
        </AchievementHoverSummary>
      </Row>
      <Box
        style={{
          backgroundColor: "rgba(216,216,216,.055)",
          borderRadius: "12px",
          padding: "2em",
          margin: "30px auto"
        }}
      >
        <TimeseriesChart
          {...{ timeSeries, showOnly: pathParams.perspective }}
        />
      </Box>
      <Box
        style={{
          backgroundColor: "rgba(216,216,216,.055)",
          borderRadius: "12px",
          padding: "2em",
          margin: "30px auto"
        }}
      >
        <BlockTitle>Emerging Artists: Staff Picks</BlockTitle>

        <Row>
          <FeaturedArtists />
        </Row>
      </Box>
      <VerticalSpacer height="100px" />
      <ReactTooltip place="top" type="dark" effect="float" />
    </>
  );
};
