import * as React from 'react';
import { ArtistTopListenersList, ArtistTopListenersListProps } from './ArtistTopListenersList';

export default { title: 'ArtistTopListenersList' };

const listeners = [
  {
    user: {
      uid: "1",
      email: "michael",
      displayName: "Tom",
      lastUpdate: "",
      photoURL: "https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/26239546_10107757029043497_8288216314895735266_n.jpg?_nc_cat=107&_nc_oc=AQm79LaLBhXXkHRORdqrZqwCB6oOboZfen8085UDMmBAqb0CYig8cQSFcnAoZbw3up8&_nc_ht=scontent.xx&oh=affdb445090f94fea3e998bc93630f7a&oe=5DE7B7D8",
    },// ... a user object,
    total: 10000000 // a number
  },
  {
    user: {
      uid: "2",
      email: "klsldsj",
      displayName: "Sam",
      lastUpdate: "",
      photoURL: "https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/26239546_10107757029043497_8288216314895735266_n.jpg?_nc_cat=107&_nc_oc=AQm79LaLBhXXkHRORdqrZqwCB6oOboZfen8085UDMmBAqb0CYig8cQSFcnAoZbw3up8&_nc_ht=scontent.xx&oh=affdb445090f94fea3e998bc93630f7a&oe=5DE7B7D8",
    },// ... a user object,
    total: 1200000 // a number
  },
  {
    user: {
      uid: "3",
      email: "asdf",
      displayName: "Toriii",
      lastUpdate: "",
      photoURL: "https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/26239546_10107757029043497_8288216314895735266_n.jpg?_nc_cat=107&_nc_oc=AQm79LaLBhXXkHRORdqrZqwCB6oOboZfen8085UDMmBAqb0CYig8cQSFcnAoZbw3up8&_nc_ht=scontent.xx&oh=affdb445090f94fea3e998bc93630f7a&oe=5DE7B7D8",
    },// ... a user object,
    total: 500000 // a number
  }
]

const place = "first";

export const ArtistTopListenersListFirstStory = () => <ArtistTopListenersList listeners={listeners} />;
