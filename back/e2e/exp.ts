import * as R from 'ramda'
import { renameKeysWith } from 'ramda-adjunct'
// const mapKeys = R.curry((fn, obj) =>
//   R.fromPairs(R.map(R.adjust(0, fn), R.toPairs(obj))));

const foo = {
  'a': 1,
  'b': 2,
}

const bar = renameKeysWith(k => `:${k}`, foo)

// const renameKeys = R.curry((fn, obj) =>



console.log(bar)

// import moment = require("moment");

// const dts = [
//   '2019-04-11T00:26:22.000-05:00',
//   '2019-04-11T03:26:22.000-05:00',
//   '2019-04-11T06:26:22.000-05:00',
//   '2019-04-11T09:26:22.000-05:00',
//   '2019-04-11T12:26:22.000-05:00',
//   '2019-04-11T15:26:22.000-05:00',
//   '2019-04-11T18:26:22.000-05:00',
//   '2019-04-11T21:26:22.000-05:00',
//   '2019-04-12T00:26:22.000-05:00',
//   '2019-04-12T03:26:22.000-05:00',
//   '2019-04-12T06:26:22.000-05:00',
// ]

// console.log('moment/iso-false')

// for (let dt of dts) {
//   const m = moment(dt)
//   const f = m.format('YYYY-MM-DD')
//   console.log(dt, f)
// }

// console.log('parseZone/iso-false')

// for (let dt of dts) {
//   const m = moment.parseZone(dt)
//   const f = m.format('YYYY-MM-DD')
//   console.log(dt, f)
// }

