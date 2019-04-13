import * as rp from 'request-promise'

// there's some fancy ways to dynamically get your gateway uri
// but aint nobody got time for that
// const url = config.STAGE === 'local' ?
const uri = process.env.URI || 'http://localhost:4000/startHarvestAllUsers'
// const uri = 'https://lstt0brii1.execute-api.us-east-1.amazonaws.com/r1/startHarvestAllUsers'
test('poke it', async () => {
  const response = await rp({
    method: 'POST',
    uri,
    body: {},
    json: true
  })

  console.log('response', response)
})

