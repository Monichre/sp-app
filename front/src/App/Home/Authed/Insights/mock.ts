
import { InsightsDashInsightsDash, PerspectiveDashArtist, ArtistsFragmentUser, PerspectiveDashTopListeners } from '../../../../types';


const dirksPhoto = 'http://arnoldzwicky.s3.amazonaws.com/WahlbergDiggler.jpg'
const user: ArtistsFragmentUser = {
	displayName: 'Dirk Diggler',
	email: 'dirk@diggler.com',
	photoURL: dirksPhoto,
	uid: 'spotify:1121486086'
}

const topListeners: any = {
		day: {
			first: {
				total: 12300,
				user: {
					displayName: 'Dirk Diggler',
					email: 'dirk@diggler.com',
					photoURL: dirksPhoto,
					uid: 'spotify:1121486086'
				}
			},
			second: {
        	total: 12300,
				user: {
					displayName: 'Dirk Diggler',
					email: 'dirk@diggler.com',
					photoURL: dirksPhoto,
					uid: 'spotify:1121486086'
				}
      },
			third: {
        	total: 12300,
				user: {
					displayName: 'Dirk Diggler',
					email: 'dirk@diggler.com',
					photoURL: dirksPhoto,
					uid: 'spotify:1121486086'
				}
      }
		},
		week: {
			first: {
				total: 12300,
				user: {
					displayName: 'Dirk Diggler',
					email: 'dirk@diggler.com',
					photoURL: dirksPhoto,
					uid: 'spotify:1121486086'
				}
			},
			second: {
        	total: 12300,
				user: {
					displayName: 'Dirk Diggler',
					email: 'dirk@diggler.com',
					photoURL: dirksPhoto,
					uid: 'spotify:1121486086'
				}
      },
			third: {
        	total: 12300,
				user: {
					displayName: 'Dirk Diggler',
					email: 'dirk@diggler.com',
					photoURL: dirksPhoto,
					uid: 'spotify:1121486086'
				}
      }
		},
		month: {
			first: {
				total: 12300,
				user: {
					displayName: 'Dirk Diggler',
					email: 'dirk@diggler.com',
					photoURL: dirksPhoto,
					uid: 'spotify:1121486086'
				}
			},
			second: {
        	total: 12300,
				user: {
					displayName: 'Dirk Diggler',
					email: 'dirk@diggler.com',
					photoURL: dirksPhoto,
					uid: 'spotify:1121486086'
				}
      },
			third: {
        	total: 12300,
				user: {
					displayName: 'Dirk Diggler',
					email: 'dirk@diggler.com',
					photoURL: dirksPhoto,
					uid: 'spotify:1121486086'
				}
      }
		},
		life: {
			first: {
				total: 12300,
				user: {
					displayName: 'Dirk Diggler',
					email: 'dirk@diggler.com',
					photoURL: dirksPhoto,
					uid: 'spotify:1121486086'
				}
			},
			second: {
        	total: 12300,
				user: {
					displayName: 'Dirk Diggler',
					email: 'dirk@diggler.com',
					photoURL: dirksPhoto,
					uid: 'spotify:1121486086'
				}
      },
			third: {
        	total: 12300,
				user: {
					displayName: 'Dirk Diggler',
					email: 'dirk@diggler.com',
					photoURL: dirksPhoto,
					uid: 'spotify:1121486086'
				}
      }
		}
	}

const AR1: PerspectiveDashArtist = {
	id: '1',
	name: 'A Long Ass Artist Name',
	images: [
		{ url: 'https://i.scdn.co/image/5e05e74fb744d3c80005fd68a49f74ef6e4fa3cb' }
	],
	topListeners
}
const AR2: PerspectiveDashArtist = {
  id: '2', name: 'A2', images: [{ url: 'https://i.scdn.co/image/5e05e74fb744d3c80005fd68a49f74ef6e4fa3cb' }],
 topListeners
}
const AR3: PerspectiveDashArtist = { id: '3', name: 'A3', images: [ { url: 'https://i.scdn.co/image/5e05e74fb744d3c80005fd68a49f74ef6e4fa3cb' }],topListeners}
const AR4: PerspectiveDashArtist = { id: '4', name: 'A4', images: [ { url: 'https://i.scdn.co/image/5e05e74fb744d3c80005fd68a49f74ef6e4fa3cb' }],topListeners}
const AR5: PerspectiveDashArtist = { id: '5', name: 'A5', images: [ { url: 'https://i.scdn.co/image/5e05e74fb744d3c80005fd68a49f74ef6e4fa3cb' }],topListeners}
const AR6: PerspectiveDashArtist = { id: '6', name: 'A6', images: [ { url: 'https://i.scdn.co/image/5e05e74fb744d3c80005fd68a49f74ef6e4fa3cb' }],topListeners}

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


// const third = { sk: '3nnQpaTvKb5jCQabZefACI#first#life#life#2019-07-18',
//   total: 2312317,
//   pk: '3nnQpaTvKb5jCQabZefACI#topListener#life#life',
//   user:
//    { photoURL:
//       'https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/27073066_10102681350144831_3294770492597424902_n.jpg?_nc_cat=104&_nc_oc=AQk3_SfJitwb6umCXG2Bt-DGJXmotHjxQ5ITSz4d6wTs_RtvcjoYxigI_Dz8P2MjOFI&_nc_ht=scontent.xx&oh=1c8acd250f3c8d0cfdc424646fe4bc63&oe=5DB89AEC',
//      uid: 'spotify:124053034',
//      utcOffset: -240,
//      displayName: 'Liam Ellis',
//      lastUpdate: '2019-07-18T15:08:49.553Z',
//      sk: 'spotify',
//      spotifyId: '124053034',
//      totalUpdates: 1,
//      pk: 'spotify:124053034',
//      accessToken:
//       'BQBH4lOU2LdYr5BqCujjgb9avUEmlODoQBaVmN3rErgPBp3a5X5Z1sDAVozRBb_RoLtGff00RQ1px-Mu5RRaoim635P5qhNo2bakjwJHFPjRUsBjgbdxYgvEobMHHfkfNVoGtt0dedO8nSX-utU9Qf549AFNeHFrq-1U_4agaPJOyAtWIl7kwZBTfTo3xsczFxie3qWC36r1K0BkuKRfoYhcx1vAbeR24GyGxsBDSNJMpvvjhuyDhCIGSA',
//      email: 'ellis245@umn.edu',
//      refreshToken:
//       'AQAl5TlRgC87Bou9sIwATrVoNBuLbpz3oDs5WsdfWdDbK3H8QskwmT8ZDSFlctu9DurSToYQPKaGE5VjyTKohsXp7Uzy-Sii1tA2Fl134rHDWzitxdkqa8DZC9J8qyhQsKvuog' } }
// }