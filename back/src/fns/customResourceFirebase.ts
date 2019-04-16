import { CloudFormationCustomResourceHandler } from "aws-lambda";
import { createGCPWithFBAuth } from './createGCPWithFBAuth'

// not used atm

// clean this shit up
// TODO: handle resource-remove
export const handler: CloudFormationCustomResourceHandler = async (event, context) => {
  try {
    console.log('CustomResourceHandlerEvent', JSON.stringify(event, null, 2))
    const { GCPProjectId: projectId, GCPAPIKey: apiKey } = event.ResourceProperties
    // const resourceUri = await createGCPWithFBAuth(projectId, apiKey)
    const resourceUri = 'dummy'
    const data = { resourceUri, }
    const physicalId = 'something'
    console.log('response', data)
    await send(event, context, SUCCESS, data, physicalId)
  } catch (err) {
    console.log('failed', err)
    await send(event, context, FAILED, err)
  }

}

/*
  Copyright 2015 Amazon Web Services, Inc. or its affiliates. All Rights Reserved.
   This file is licensed to you under the AWS Customer Agreement (the "License").
   You may not use this file except in compliance with the License.
   A copy of the License is located at http://aws.amazon.com/agreement/ .
   This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied.
   See the License for the specific language governing permissions and limitations under the License.
*/

import * as https from 'https'
import * as url from 'url'

export const SUCCESS = "SUCCESS";
export const FAILED = "FAILED";

export const send = async (event, context, responseStatus, responseData, physicalResourceId=null, noEcho=false) => {
  var responseBody = JSON.stringify({
      Status: responseStatus,
      Reason: "See the details in CloudWatch Log Stream: " + context.logStreamName,
      PhysicalResourceId: physicalResourceId || context.logStreamName,
      StackId: event.StackId,
      RequestId: event.RequestId,
      LogicalResourceId: event.LogicalResourceId,
      NoEcho: noEcho || false,
      Data: responseData
  });

  console.log("Response body:\n", responseBody);

  var parsedUrl = url.parse(event.ResponseURL);
  var options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.path,
      method: "PUT",
      headers: {
          "content-type": "",
          "content-length": responseBody.length
      }
  };

  const response = await requestPromise(options, responseBody)
  console.log('Response', response)
}

const requestPromise = (options, responseBody) =>
  new Promise((resolve, reject) => {
    try {
      const request = https.request(options, res => {
        console.log("Status code: " + res.statusCode);
        console.log("Status message: " + res.statusMessage);
        res.on('end', resolve)
        res.on('error', reject)
      })
      request.on('error', reject)
      request.write(responseBody)
      request.end()
    } catch (err) {
      console.log('requestPromise error', err)
      reject(err)
    }
  })

