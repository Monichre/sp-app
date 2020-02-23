import * as React from "react";
import { hrsAndMins } from "../../../lib/durationFormats";
import { Box } from "rebass";
import { badgeMap } from "../../Home/Authed/Insights/shared/ArtistsChart/TopListenerYAxis";
import { AvatarBg } from "../Elements";
import { TopListeners, Badge2 } from "./ArtistTopListenersList.styles";
import fallbackAvatar from "../../../shared/images/fallback-avatar.svg";

export interface ArtistTopListenersListProps {
  listeners: any;
}

export const ArtistTopListenersList: React.SFC<ArtistTopListenersListProps> = ({
  listeners
}) => {
  return (
    <TopListeners className="ArtistTopListenersList">
      {Object.keys(listeners).map((place: any) => {
        const listener = listeners[place];
        const { user } = listener;
        const { hrs, mins } = hrsAndMins(listener.total);
        const hours = hrs ? `${hrs} hours & ` : "";
        const minutes = mins ? `${mins} mins` : "";
        const ttl = `${hours}${minutes}`;

        console.log(user);

        if (!user) {
          return <div></div>;
        }

        return (
          <Box className="boxguy" mt={45}>
            <Badge2
              className="boxguy2"
              count={
                <img
                  src={badgeMap[place]}
                  style={{
                    height: "30px",
                    width: "30px",
                    zIndex: 2,
                    left: "40%"
                  }}
                />
              }
            >
              <AvatarBg
                class="AvatarBg"
                artistPage
                style={{
                  marginTop: "0.5rem"
                }}
              >
                <img
                  src={user.photoURL}
                  onError={e => {
                    (e.target as HTMLImageElement).src = fallbackAvatar;
                  }}
                />
              </AvatarBg>
              <div className="texty">
                <br />
                <br />
                <br />
                <br />
                <br />
                <h4
                  style={{
                    color: "#fff",
                    position: "relative",
                    zIndex: 2,
                    textTransform: "capitalize"
                  }}
                >
                  {place} place all time top listener <br /> {user.displayName}
                </h4>
                <p style={{ position: "relative", zIndex: 2 }}>
                  <b>{ttl}</b>
                </p>
              </div>
            </Badge2>
          </Box>
        );
      })}
    </TopListeners>
  );
};
