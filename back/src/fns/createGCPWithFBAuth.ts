import { Resource } from '@google-cloud/resource'
// import { GoogleAuth, auth } from 'google-auth-library';

// once we get this working, see how hard it is to use the http api
// instead of the libraries
// save on our deployment size

// working locally
// still need to pass gcp creds
export const createGCPWithFBAuth = async (projectId: string, APIKey: string) => {
  // const fromApi = await auth.fromAPIKey(APIKey)
  // console.log('fromApi', fromApi)
  const resource = new Resource()

  const [projects] = await resource.getProjects()
  console.log('projects found', projects.map(p => p.projectId))
  const found = projects.find(p => p.projectId == projectId)
  console.log(found ? `Found ${JSON.stringify(found)}` : `Could not find ${projectId}`)

  const op = await resource.createProject(projectId)
  console.log('result', op)
  return false
}

  // const resource = new Resource({clientOptions: fromApi})
  // resource.authClient = new GoogleAuth({clientOptions: fromApi})

  // const creds = auth.fromAPIKey(APIKey)
  // creds.getCredentials()
  // resource.authClient = new GoogleAuth({
  //   credentials: await auth.fromAPIKey(APIKey).getCredentials()
  // })
  // resource.authClient = auth.fromAPIKey(APIKey)
