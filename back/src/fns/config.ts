import * as AWS from 'aws-sdk';

export const config = async () => {
  const ssm = new AWS.SSM()
  const params = await ssm.getParametersByPath({
    Path: '/sp/local',
    Recursive: true,
  }).promise()
  return params
}
