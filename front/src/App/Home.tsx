import React from 'react';
import { useUser } from '../comp/FirebaseContext';
import { Dash } from './Dash';
import { SignIn } from './SignIn';
import { Loading } from '../comp/Loading';

// export const Home: React.SFC<HomeViewProps> = () => {
//   const { user, isLoading } = useUser()
//   if (isLoading) return <div>Loading...</div>
//   return (
//     <LayoutAppBar>
//       <React.Suspense fallback={<Loading/>}>
//         <h1>Home</h1>
//         { user ? <div>hello {user.displayName}!</div> : <Hero/> }
//         <hr/>
//         <PingResult/>
//       </React.Suspense>
//     </LayoutAppBar>
//   )

export const Home: React.SFC = () => {
  const { user, isLoading } = useUser()
  if (isLoading) return <Loading/>
  return user ? <Dash/> : <SignIn/>
}
