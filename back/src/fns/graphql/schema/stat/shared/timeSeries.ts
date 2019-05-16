import { TTableStat, PeriodType, RelationType } from "../../../../../shared/tables/TableStat";
import moment = require("moment");
import { range } from 'ramda';



const localizedISOString = (m: moment.Moment) => m.toISOString(true)

export type TMomentUnits = 'days' | 'weeks' | 'months'

type TTimeSeriesKeys = {
  endDate: moment.Moment
  unit: TMomentUnits
  distance: number
  uid: string
  gid: string
  periodType: PeriodType
  relationType: RelationType
  relationId: string
}

const timeSeriesKeyRange = (endDate: moment.Moment, unit: 'days' | 'weeks' | 'months', distance: number) =>
  range(0, distance).map(d => {
    console.log('range', d)
    const dt = endDate.clone().subtract(d, unit)
    console.log('dt', dt)
    return dt
  })

export const timeSeries = async (tableStat: TTableStat, label: string, {endDate, unit, distance, uid, gid, periodType, relationType, relationId}: TTimeSeriesKeys) => {
  const dateRange = timeSeriesKeyRange(endDate, unit, distance).reverse()
  console.log('dateRange', unit, distance, dateRange)
  const keyRange = dateRange.map(m => tableStat.periodsFor(localizedISOString(m))[periodType])
  const { [periodType]: endPeriod } = tableStat.periodsFor(localizedISOString(endDate))
  const { [periodType]: startPeriod } = tableStat.periodsFor(localizedISOString(dateRange[0]))
  const personals = await tableStat.getTimeseries({uid, relationType, relationId, periodType, startPeriod, endPeriod})
  const groups = await tableStat.getTimeseries({uid: gid, relationType, relationId, periodType, startPeriod, endPeriod})
  const values = keyRange.map((period, idx) => {
    const personalFound = personals.find(v => v.period === period)
    const groupFound = groups.find(v => v.period === period)
    return {
      period,
      personal: (personalFound ? personalFound.playDurationMs : 0) / 3600000,
      group: (groupFound ? groupFound.playDurationMs : 0) / 3600000,
    }
  })
  return {
    label,
    values,
  }
}