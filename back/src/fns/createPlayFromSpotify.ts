import { KinesisStreamHandler } from "aws-lambda";

export const handler: KinesisStreamHandler = async (event, context) => {
  // console.log('kinesis:', JSON.stringify(event, null, 2))
  const datas = event.Records.map(r => {
    const payload = new Buffer(r.kinesis.data, 'base64').toString()
    return JSON.parse(payload)
  })

  console.log('incoming records', JSON.stringify(datas, null, 2))
}
