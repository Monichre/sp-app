import * as React from "react";
import {
  ListElement,
  ArtistInfo,
  ArtistImage,
  OrderNumber,
  ArtistName,
  TimePlayed
} from "./ArtistListElement.styles";
import { HorizontalRule } from "./TopFiveTimePeriod.styles";
import { Artist } from "../../../../../back/src/fns/graphql/types";
import { hrsAndMins } from "../../../lib/durationFormats";

const formatListeningTime = (total: number) => {
  const totalInMilliseconds = total * 3600000;
  const { hrs, mins } = hrsAndMins(totalInMilliseconds);
  const hours = hrs ? `${hrs}h ` : "";
  const minutes = mins ? `${mins}m` : "";

  return `${hours}${minutes}`;
};

export type ArtistListElementProps = {
  artist: Artist;
  place: number;
  totalTimeListened: number;
  perspective: string;
};

export const ArtistListElement: React.SFC<ArtistListElementProps> = ({
  artist,
  place,
  totalTimeListened,
  perspective
}) => {
  const ttl = formatListeningTime(totalTimeListened);
  return (
    <div>
      {/* Better method for this? */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
      body { 
        overflow: hidden;
      }
    `
        }}
      />
      <ListElement>
        <OrderNumber>{place}</OrderNumber>
        <ArtistInfo>
          <ArtistName>{artist.name}</ArtistName>
          <TimePlayed>{perspective == "My" ? ttl : "Me: " + ttl}</TimePlayed>
        </ArtistInfo>
        <ArtistImage src={artist.images[0].url} alt="" />
      </ListElement>
      {place == 5 ? null : <HorizontalRule />}
    </div>
  );
};
