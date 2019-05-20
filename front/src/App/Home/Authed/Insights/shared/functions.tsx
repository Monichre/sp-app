import { History } from 'history'

export type TTimeScopeOption = 'today' | 'thisWeek' | 'thisMonth' | 'lifetime'
export type TPerspectiveOption = 'personal' | 'group'

export type TPathParams = {
  timeScope: TTimeScopeOption,
  groupId: string,
  perspective: TPerspectiveOption,
  focus?: string,
}

export const insightLink = ({timeScope, groupId, perspective, focus}: TPathParams) =>
  `/insights/${timeScope}/${groupId}/${perspective}` + (focus && focus > "" ? `/${focus}` : '')

export const navigateTo = (history: History, path: string) => history.push(path)

export const artistLink = (pathParams: TPathParams, artistId: string) =>
  insightLink(Object.assign({}, pathParams, { focus: `artists/${artistId}`}))


export const genreLink = (pathParams: TPathParams, genre: string) =>
  insightLink(Object.assign({}, pathParams, { focus: `genres/${genre}`}))
