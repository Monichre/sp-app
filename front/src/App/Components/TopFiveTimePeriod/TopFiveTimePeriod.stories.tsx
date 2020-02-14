import * as React from "react";
import { TopFiveTimePeriod } from "./TopFiveTimePeriod";

export default { title: "TopFiveTimePeriod" };

const artists = [
  {
    artistName: "Weezer",
    timePlayed: "12h 5m",
    artistImage: "https://via.placeholder.com/100",
    artistPlace: 1
  },
  {
    artistName: "System of a Down",
    timePlayed: "10h 20m",
    artistImage: "https://via.placeholder.com/100",
    artistPlace: 2
  },
  {
    artistName: "The Shins",
    timePlayed: "9h 33m",
    artistImage: "https://via.placeholder.com/100",
    artistPlace: 3
  },
  {
    artistName: "Lil Yachty",
    timePlayed: "4h 13m",
    artistImage: "https://via.placeholder.com/100",
    artistPlace: 4
  },
  {
    artistName: "Gucci Mane",
    timePlayed: "2h 49m",
    artistImage: "https://via.placeholder.com/100",
    artistPlace: 5
  }
];

export const TopFiveTimePeriodFirstStory = () => (
  <TopFiveTimePeriod artistArray={artists} />
);
