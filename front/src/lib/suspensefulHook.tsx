import { QueryHookResult } from 'react-apollo-hooks';

type TPollParams = {
  stopPoll?: boolean
}

export const suspensefulHook = <TQuery, TVariables>(result: QueryHookResult<TQuery, TVariables>) => {
  if (!result.data) { throw new Error('query had no data, is not possible!!!11!!')}
 
  console.log('TCL: result', result)
  return result.data
}


export const suspensefulPollingHook = <TPollParams, TQuery, TVariables>(stopPoll: TPollParams, result: QueryHookResult<TQuery, TVariables>) => {
  
  console.count('suspensefulPollingHook')

  if (!result.data) { throw new Error('query had no data, is not possible!!!11!!')}
  if(stopPoll) {
    
    const {stopPolling, data}: any = result
    const {insightsArtists: {
      lifetime, thisMonth, thisWeek, today
    }} = data

    
    const lifetimeIsNotEmpty = lifetime.personal.length || lifetime.group.length
    const thisMonthIsNotEmpty = thisMonth.personal.length || thisMonth.group.length
    const thisWeekIsNotEmpty = thisWeek.personal.length || thisWeek.group.length
    const todayIsNotEmpty = today.personal.length || today.group.length

    if(lifetimeIsNotEmpty && thisMonthIsNotEmpty && thisWeekIsNotEmpty && todayIsNotEmpty) {
      stopPolling()
    }
    
  }
  
  console.log('TCL: result', result)
  return result.data
}