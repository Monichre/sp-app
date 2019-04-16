import moment from 'moment'

export const hrsAndMinsAndSecs = (durationMs: number) => {
  const d = moment.duration(durationMs)
  return {
    hrs: Math.abs(Math.trunc(d.asHours())),
    mins: Math.abs(d.minutes()),
    secs: Math.abs(d.seconds()),
  }
}