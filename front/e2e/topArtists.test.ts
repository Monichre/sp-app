import puppeteer from 'puppeteer'
import { users, globals, signIn, delay, triggerStartHarvestAllUsers } from './shared';

const TARGET = process.env.TARGET || 'local'
const URL = TARGET === 'local' ? 'http://localhost:3000' : 'generate s3 url'
console.log(`Running e2e against ${TARGET}: ${URL}`)

let page: puppeteer.Page
let browser: puppeteer.Browser

// there's some fancy ways to dynamically get your gateway uri
// but aint nobody got time for that
// const url = config.STAGE === 'local' ?

beforeAll(async () => {
  await triggerStartHarvestAllUsers()
})

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

const expectTopArtists = async (sel: string, rows: {name: string, hours: number, minutes: number}[]) => {
  const items = await page.$$(`${sel} > [data-test="artist-row"]`)
  expect(items.length).toEqual(rows.length)
  for (let idx = 0; idx < rows.length; idx++) {
    const { name, hours, minutes } = rows[idx]
    const foundName = await items[idx].$eval('[data-test="artist-row-name"]', el => el.textContent)
    const foundHours = await items[idx].$eval('[data-test="artist-row-hours"]', el => el.textContent)
    const foundMinutes = await items[idx].$eval('[data-test="artist-row-minutes"]', el => el.textContent)
    expect(foundName).toEqual(name)
    expect(foundHours).toEqual(hours.toString())
    expect(foundMinutes).toEqual(minutes.toString())
  }

}

describe('seeing top artist stats', () => {
  for (const user of [users.NoHistory, users.WithHistory, users.BigHistory]) {

    describe(`a user with ${user.description}`, () => {
      const user = users.NoHistory
  
      test('i should see these global and personal top artists', async () => {
        await signIn(page, URL, user)
        await page.waitForSelector('[data-test="top-artists-period-select"]')
        await page.select('[data-test="top-artists-period-select"]', '/life')
        await expectTopArtists('[data-test="top-artists-global"]', globals.topArtists)
        await expectTopArtists('[data-test="top-artists-personal"]', user.topArtistsLife)
      }, 30000)
    })
  

  }

})