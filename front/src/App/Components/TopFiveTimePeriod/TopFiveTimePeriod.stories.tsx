import * as React from "react";
import { TopFiveTimePeriod } from "./TopFiveTimePeriod";

export default { title: "TopFiveTimePeriod" };

const artists = [
  {
    artistName: "Weezer",
    timePlayed: 12,
    artistImage: "https://via.placeholder.com/50",
    artistPlace: 1
  },
  {
    artistName: "System of a Down",
    timePlayed: 10,
    artistImage: "https://via.placeholder.com/50",
    artistPlace: 2
  },
  {
    artistName: "The Shins",
    timePlayed: 9,
    artistImage: "https://via.placeholder.com/50",
    artistPlace: 3
  },
  {
    artistName: "Lil Yachty",
    timePlayed: 4,
    artistImage: "https://via.placeholder.com/50",
    artistPlace: 4
  },
  {
    artistName: "Gucci Mane",
    timePlayed: 2,
    artistImage: "https://via.placeholder.com/50",
    artistPlace: 5
  }
];

export const TopFiveTimePeriodFirstStory = () => (
  <TopFiveTimePeriod artistArray={artists} />
);
