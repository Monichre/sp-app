import * as React from 'react';
import { TopFiveTimePeriod } from './TopFiveTimePeriod';

export default { title: 'TopFiveTimePeriod' };

const artists = [
  {
    artistName: "Weezer",
    timePlayed: 12,
    artistImage: "https://via.placeholder.com/100",
  },
  {
    artistName: "System of a Down",
    timePlayed: 10,
    artistImage: "https://via.placeholder.com/100"
  },
  {
    artistName: "The Shins",
    timePlayed: 9,
    artistImage: "https://via.placeholder.com/100"
  },
  {
    artistName: "Lil Yachty",
    timePlayed: 4,
    artistImage: "https://via.placeholder.com/100"
  },
  {
    artistName: "Gucci Mane",
    timePlayed: 2,
    artistImage: "https://via.placeholder.com/100"
  },
]

export const TopFiveTimePeriodFirstStory = () => <TopFiveTimePeriod artistArray={artists} />;
