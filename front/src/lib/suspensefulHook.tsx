import { QueryHookResult } from 'react-apollo-hooks';

export const suspensefulHook = <TQuery, TVariables>(result: QueryHookResult<TQuery, TVariables>) => {
  if (!result.data) { throw new Error('query had no data, is not possible!!!11!!')}
  console.log('TCL: result', result)
  return result.data
}


