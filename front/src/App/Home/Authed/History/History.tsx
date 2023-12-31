import React, { useEffect, useState } from "react";
import { useRecentPlays } from "../../../../types";
import styled from "styled-components";
import { Play } from "./Play";
import { Container } from "../../../../shared/ui";

const Card = styled.div`
  padding: 1rem;
  margin: 0 0.5rem 0.25rem 0.5rem;
`;

const CardAlert = styled(Card)`
  background-color: rgba(216, 216, 216, 0.05);
`;

const Note = styled.div`
  padding: 0 1.5rem;
  font-size: 0.75rem;
  font-weight: 300;
  color: #aaa !important;
`;

const HistoryGrid = styled.div`
  display: grid;
  margin: auto;
  // margin-top: 2rem;
  // align-items: center;
  max-width: 760px;
  width: 100%;
  grid-template-columns: 1fr;

  @media (max-width: 760px) {
    grid-gap: 100px;
  }

  @media (min-width: 760px) {
    background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0) 49.99%,
      rgba(100, 214, 238, 1) 50%,
      rgba(0, 0, 0, 0) 50.2%
    );
    background-position: 0 8rem;

    & > *:nth-child(odd) > * {
      margin-bottom: -6rem;
      // background: red;
      justify-self: start;
      // border: 1px solid blue;
    }

    & > *:nth-child(even) > * {
      margin-bottom: -6rem;
      // background: blue;
      justify-self: end;
      // border: 1px solid red;
    }
  }
`;

const HistoryRow = styled.div`
  // display: flex;
  // flex-direction: row;
  // display: grid;
  // grid-template-columns: 1fr;
  width: 100%;
  // align-items: center;
  @media (max-width: 759px) {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  @media (min-width: 760px) {
    display: grid;
    grid-template-columns: 1fr;
    background-image: radial-gradient(
      circle,
      rgb(100, 214, 238, 1) 1%,
      rgb(0, 0, 0, 0) 1%
    );
    background-position: 0 0rem;
  }
`;

export const History: React.SFC<{ uid: string; user: any }> = ({
  uid,
  user
}) => {
  if (user) {
    //@ts-ignore
    window.Intercom("trackEvent", "page-navigation", {
      name: user.displayName || "N/A", // Full name
      email: user.email || "N/A", // Email address
      user_id: user.uid,
      avatar: {
        type: "avatar",
        image_url: user.photoURL
      }, // current_user_id
      page: "history"
    });
  }
  const [pollInterval, setPollInterval] = useState(2000);
  const { data, error, errors } = useRecentPlays({
    variables: { uid },
    suspend: true,
    pollInterval
  });
  if (error) {
    throw new Error(JSON.stringify(error));
  }
  if (errors) {
    throw new Error(JSON.stringify(errors));
  }

  console.log("data", data);
  const recentPlays =
    (data && data.recentPlays && data.recentPlays.plays) || [];
  const lastUpdate = data && data.recentPlays && data.recentPlays.lastUpdate;
  useEffect(() => setPollInterval(lastUpdate ? 10000 : 3000), [lastUpdate]);

  if (!lastUpdate) {
    return <CardAlert>Interrogating Spotify about your listening...</CardAlert>;
  }
  if (lastUpdate && recentPlays.length === 0) {
    return (
      <CardAlert data-test="alert-no-history">
        You don't seem to have any history in spotify. Go listen to something!
      </CardAlert>
    );
  }

  return (
    <Container>
      <HistoryGrid data-test="play-timeline">
        {recentPlays.map((play, key) => (
          <HistoryRow {...{ key }}>
            <Play {...{ play }} />
          </HistoryRow>
        ))}
      </HistoryGrid>
      <Note>Last Update: {lastUpdate || "never"}</Note>
    </Container>
  );
};
