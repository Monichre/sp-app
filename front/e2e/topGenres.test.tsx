import puppeteer from 'puppeteer'
import { users, globals, signIn, launchBrowser, triggerStartHarvestAllUsers } from './shared';

const TARGET = process.env.TARGET || 'local'
const URL = TARGET === 'local' ? 'http://localhost:3000' : 'generate s3 url'
console.log(`Running e2e against ${TARGET}: ${URL}`)

const WATCH = process.env.WATCH ? true : false

let page: puppeteer.Page
let browser: puppeteer.Browser

// there's some fancy ways to dynamically get your gateway uri
// but aint nobody got time for that
// const url = config.STAGE === 'local' ?

beforeAll(async () => {
  await triggerStartHarvestAllUsers()
})

beforeEach(async () => {
  browser = await launchBrowser(WATCH)
  page = await browser.newPage()
})

afterEach(async () => {
  await browser.close()
})

const expectTopGenres = async (sel: string, rows: {name: string, hours: number, minutes: number}[]) => {
  const items = await page.$$(`${sel} > [data-test="genre-row"]`)
  expect(items.length).toEqual(rows.length)
  for (let idx = 0; idx < rows.length; idx++) {
    const { name, hours, minutes } = rows[idx]
    const foundName = await items[idx].$eval('[data-test="genre-row-name"]', el => el.textContent)
    const foundHours = await items[idx].$eval('[data-test="genre-row-hours"]', el => el.textContent)
    const foundMinutes = await items[idx].$eval('[data-test="genre-row-minutes"]', el => el.textContent)
    expect(foundName).toEqual(name)
    expect(foundHours).toEqual(hours.toString())
    expect(foundMinutes).toEqual(minutes.toString())
  }

}

describe('seeing top genre stats', () => {
  for (const user of [users.NoHistory, users.WithHistory, users.BigHistory]) {

    describe(`user ${user.email} with ${user.description}`, () => {  

      test(`i should see all global and ${user.topGenresLife.length} personal top genres`, async () => {
        await signIn(page, URL, user)
        await page.waitForSelector('[data-test="top-artists-period-select"]')
        await page.select('[data-test="top-artists-period-select"]', '/life')
        await expectTopGenres('[data-test="top-genres-global"]', globals.topGenres)
        await expectTopGenres('[data-test="top-genres-personal"]', user.topGenresLife)
      }, 30000)
    })
  

  }

})