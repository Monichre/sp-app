// @ts-nocheck
import * as moment from 'moment'

export const hrsAndMinsAndSecs = (durationMs: number) => {
  const d = moment.duration(durationMs)
  return {
    // @ts-ignore
    hrs: Math.abs(Math.trunc(d.asHours())),
    mins: Math.abs(d.minutes()),
    secs: Math.abs(d.seconds()),
  }
}

export const hrsMaybeMins = ({hrs, mins}: {hrs: number, mins: number}) =>
  hrs > 100 ? { hrs } : { hrs, mins }

  export type DecimalHoursToMinutes = string
  // @ts-ignore
export const decimalToHrsMins = (value: number): DecimalHoursToMinutes => `${Math.floor(value)}:${Math.floor((value % 1) * 60).toString().padStart(2, '0')}`

export const hrsAndMins = (durationMs: number) => {
	const d = moment.duration(durationMs)
  return {
		// @ts-ignore
		hrs: Math.abs(Math.trunc(d.asHours())),
		mins: Math.abs(d.minutes())
	}
}
