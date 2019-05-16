import { InsightsDashInsightsDash } from "../../../../types";


const AR1 = { id: '1', name: 'A Long Ass Artist Name', images: [ { url: 'https://i.scdn.co/image/5e05e74fb744d3c80005fd68a49f74ef6e4fa3cb' }]}
const AR2 = { id: '2', name: 'A2', images: [ { url: 'https://i.scdn.co/image/5e05e74fb744d3c80005fd68a49f74ef6e4fa3cb' }]}
const AR3 = { id: '3', name: 'A3', images: [ { url: 'https://i.scdn.co/image/5e05e74fb744d3c80005fd68a49f74ef6e4fa3cb' }]}
const AR4 = { id: '4', name: 'A4', images: [ { url: 'https://i.scdn.co/image/5e05e74fb744d3c80005fd68a49f74ef6e4fa3cb' }]}
const AR5 = { id: '5', name: 'A5', images: [ { url: 'https://i.scdn.co/image/5e05e74fb744d3c80005fd68a49f74ef6e4fa3cb' }]}
const AR6 = { id: '6', name: 'A6', images: [ { url: 'https://i.scdn.co/image/5e05e74fb744d3c80005fd68a49f74ef6e4fa3cb' }]}

export const useInsightsData = (): InsightsDashInsightsDash => {

  return {
    today: {
      timeSeries: {
        label: 'Past 7 Days',
        values: [
          {
            personal: 3,
            group: 4,
            period: '2019-05-05',
          },
          {
            personal: 2,
            group: 5.5,
            period: '2019-05-04',
          },
          {
            personal: 1.3,
            group: 6.1,
            period: '2019-05-03',
          }
        ],
      },
      personal: {
        artists: [
          { personal: 3, group: 39.3, artist: AR1 },
          { personal: 2.5, group: 57.3, artist: AR2 },
          { personal: 1.77, group: 19.9, artist: AR3 },
        ],
        genres: []
      },
      group: {
        artists: [
          { personal: 2.5, group: 57.3, artist: AR2 },
          { personal: 3, group: 39.3, artist: AR1 },
          { personal: 1.77, group: 19.9, artist: AR3 },
        ],
        genres: []
      }
    },
    thisWeek: {
      timeSeries: {
        label: 'Past 4 Weeks',
        values: [
          {
            personal: 3,
            group: 4,
            period: '2019-05-05',
          },
          {
            personal: 2,
            group: 5.5,
            period: '2019-05-04',
          },
          {
            personal: 1.3,
            group: 6.1,
            period: '2019-05-03',
          }
        ],
      },
      personal: {
        artists: [
          { personal: 3, group: 3.3, artist: AR1 },
          { personal: 2.5, group: 5.3, artist: AR2 },
          { personal: 1.77, group: 1.9, artist: AR3 },
        ],
        genres: []
      },
      group: {
        artists: [
          { personal: 3, group: 3.3, artist: AR1 },
          { personal: 2.5, group: 5.3, artist: AR2 },
          { personal: 1.77, group: 1.9, artist: AR3 },
        ],
        genres: []  
      }
    },
    thisMonth: {
      timeSeries: {
        label: 'Past 4 Months',
        values: [
          {
            personal: 3,
            group: 4,
            period: '2019-05-05',
          },
          {
            personal: 2,
            group: 5.5,
            period: '2019-05-04',
          },
          {
            personal: 1.3,
            group: 6.1,
            period: '2019-05-03',
          }
        ],
      },
      personal: {
        artists: [
          { personal: 3, group: 3.3, artist: AR1 },
          { personal: 2.5, group: 5.3, artist: AR2 },
          { personal: 1.77, group: 1.9, artist: AR3 },
        ],
        genres: []
      },
      group: {
        artists: [
          { personal: 3, group: 3.3, artist: AR1 },
          { personal: 2.5, group: 5.3, artist: AR2 },
          { personal: 1.77, group: 1.9, artist: AR3 },
        ],
        genres: []
      }
    },
    lifetime: {
      timeSeries: {
        label: 'Past 6 Months',
        values: [
          {
            personal: 3,
            group: 4,
            period: '2019-05-05',
          },
          {
            personal: 2,
            group: 5.5,
            period: '2019-05-04',
          },
          {
            personal: 1.3,
            group: 6.1,
            period: '2019-05-03',
          }
        ],
      },
      personal: {
        artists: [
          { personal: 3, group: 3.3, artist: AR1 },
          { personal: 2.5, group: 5.3, artist: AR2 },
          { personal: 1.77, group: 1.9, artist: AR3 },
        ],
        genres: []
      },
      group: {
        artists: [
          { personal: 3, group: 3.3, artist: AR1 },
          { personal: 2.5, group: 5.3, artist: AR2 },
          { personal: 1.77, group: 1.9, artist: AR3 },
        ],
        genres: []
      }
    },
  }
}