import * as rp from 'request-promise'

// there's some fancy ways to dynamically get your gateway uri
// but aint nobody got time for that
// const url = config.STAGE === 'local' ?
//   'http://localhost:4000/graphql' :
//   `https://${GATEWAY_ID}.execute-api.us-east-1.amazonaws.com/dev/graphql`

// dick move see above
const uri = 'http://localhost:4000/createProfile'

// const postSqs = (QueueName: string, MessageBody: object) =>
//   rp({
//     method: 'POST',
//     uri,
//     body: { QueueName, MessageBody },
//     json: true
//   })

// let existingUserId: string;

// const USER_BY_EMAIL = `
//   query($email: String!) {
//     userByEmail(email: $email) {
//       user_id
//       name
//       email
//     }
//   }
// `

// test('userByEmail', async () => {
//   const result = await request(USER_BY_EMAIL, { email: 'sdebaun@smashball.tv' })
//   expect(result.data.userByEmail.name).toBe('Stephen DeBaun')
//   // const result = await request(USER_BY_EMAIL, { email: 'adnordenson@gmail.com' })
//   // expect(result.data.userByEmail.name).toBe('Alex Nordenson')
//   existingUserId = result.data.userByEmail.user_id // stash this for next test
// })

// const email = 'sdebaun@smashball.tv'
// const expectedName = 'Stephen DeBaun'

// const email = 'adnordenson@gmail.com'
// const expectedName = 'Alex Nordenson'

// not used

// test('poke it', async () => {
//   const response = await rp({
//     method: 'POST',
//     uri,
//     body: { Foo: 'faz' },
//     json: true
//   })

//   console.log('respose', response)

// })
