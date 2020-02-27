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

  if (hrs === 0 && mins === 0) return "0m";
  return `${hours}${minutes}`;
};

const displayListeningTime = (ttl: string, perspective: string) => {
  if (perspective !== "Your" && ttl === "0m") {
    return "";
  } else if (perspective !== "Your") {
    return "Me: " + ttl;
  }
  return ttl;
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
  const DLT = displayListeningTime(ttl, perspective);
  console.log("xxxDLT", DLT);
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
          <TimePlayed>{DLT}</TimePlayed>
        </ArtistInfo>
        <ArtistImage src={artist.images[0].url} alt="" />
      </ListElement>
      {place == 5 ? null : <HorizontalRule />}
    </div>
  );
};
