import puppeteer from 'puppeteer'

const TARGET = process.env.TARGET || 'local'
const URL = TARGET === 'local' ? 'http://localhost:3000' : 'generate s3 url'
console.log(`Running e2e against ${TARGET}: ${URL}`)

type TrackInfo = {
  name: string,
}

type UserInfo = {
  email: string,
  password: string,
  displayName: string,
  tracks?: TrackInfo[],
}

const users: {[k: string]: UserInfo} = {
  NoHistory: {
    email: "steve@soundpruf.com",
    password: "Notagoodpassword1",
    displayName: "sp test account",  
  },
  WithHistory: {
    email: "sdebaun@sofia4ventura.com",
    password: "Notagoodpassword2",
    displayName: "sp test with history",
    tracks: [
      {
        name: 'Levitating'
      }
    ]
  }
}

let page: puppeteer.Page
let browser: puppeteer.Browser

beforeEach(async () => {
  browser = await puppeteer.launch()
  // use the below when you want to see the tests happen in an actual window
  // browser = await puppeteer.launch({
  //   headless: false,
  //   slowMo: 1,
  //   args: [`--window-size=800,640`]
  // })
  page = await browser.newPage()
})

afterEach(async () => {
  await browser.close()
})

const signIn = async (userInfo: UserInfo) => {
  // go to the home page
  await page.goto(URL)
  await page.waitForSelector('[data-test="spotifyLogin"]')
  await page.click('[data-test="spotifyLogin"]')
  // on spotify page fill out the form and click the button
  await page.waitForSelector('[name="username"]')
  await page.type('[name="username"]', userInfo.email)
  await page.waitForSelector('[name="password"]')
  await page.type('[name="password"]', userInfo.password)
  await page.waitForSelector('#login-button')
  await page.click('#login-button')
  // back on our home page i should see my name
  await page.waitForSelector('[data-test="displayName"]')
  const displayName = await page.$eval('[data-test="displayName"]', el => el.textContent)
  expect(displayName).toEqual(userInfo.displayName)
}

describe("signing in as a spotify user", () => {
  test('with NO play history', async () => {
    const u = users.NoHistory
    await signIn(u)
    // verify that i see the "go listen to something"
    await page.waitForSelector('[data-test="alert-no-history"]')
    // should probably have a link to spotify and verify that its there
  }, 30000)

  test('WITH play history', async () => {
    const u = users.WithHistory
    await signIn(u)
    // verify that i see the timeline element
    await page.waitForSelector('[data-test="play-timeline"]')
    // there should be one item there
    const items = await page.$$('[data-test="play-item-track-name"]')
    expect(items.length).toEqual(1)
    // and we should know its name
    const trackName = await page.$eval('[data-test="play-item-track-name"]', el => el.textContent)
    expect(trackName).toEqual(u.tracks && u.tracks[0] && u.tracks[0].name)
  }, 30000)
})
