
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
