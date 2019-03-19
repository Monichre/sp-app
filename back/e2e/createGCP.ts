import { createGCPWithFBAuth } from '../src/fns/createGCPWithFBAuth'

test('create a GCP Project', async () => {
  const result = await createGCPWithFBAuth('test-project', 'key')
})
