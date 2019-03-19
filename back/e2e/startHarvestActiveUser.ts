import * as rp from 'request-promise'

// there's some fancy ways to dynamically get your gateway uri
// but aint nobody got time for that
// const url = config.STAGE === 'local' ?
const uri = 'http://localhost:4000/heartbeat'

test('poke it', async () => {
  const response = await rp({
    method: 'POST',
    uri,
    body: {},
    json: true
  })

  console.log('response', response)
})

