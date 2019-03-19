import { SQSHandler } from "aws-lambda";
import * as AWS from 'aws-sdk';

export const handler: SQSHandler = async (event, context) => {
  console.log('function', JSON.stringify(context.invokedFunctionArn, null, 2))
  console.log('env.STALE_MS', process.env.STALE_MS)
  console.log('env.FETCH_COUNT', process.env.FETCH_COUNT)
  console.log('env.TABLE_SOURCE', process.env.TABLE_SOURCE)
  console.log('env.STREAM_TARGET', process.env.STREAM_TARGET)
  console.log('env.STAGE', process.env.STAGE)
  console.log('event', JSON.stringify(event, null, 2))
  const profileId = JSON.parse(event.Records[0].body).profileId
  const fakeResponse = [
    { profileId, track: { trackid: 1 }},
    { profileId, track: { trackid: 2 }},
    { profileId, track: { trackid: 3 }},
    { profileId, track: { trackid: 4 }},
    { profileId, track: { trackid: 5 }},
  ]
  const kin = process.env.STAGE==='local' ?
    new AWS.Kinesis({endpoint:'http://localhost:4567'}) :
    new AWS.Kinesis()
  
  await kin.putRecords({
    Records: fakeResponse.map(r => ({ Data: JSON.stringify(r), PartitionKey: r.track.trackid.toString()})),
    StreamName: process.env.STREAM_TARGET,
  }, () => {}).promise()
}
