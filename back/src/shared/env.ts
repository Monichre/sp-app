export const verifyEnv = <T>(envVars: T): T => {
  for (const key of Object.keys(envVars)) {
    if (!envVars[key]) { throw new Error(`No env var found for key ${key}`)}
  }
  console.log('verified env vars', JSON.stringify(envVars, null, 2))
  return envVars
}