import puppeteer from 'puppeteer'
import { users, signIn, triggerStartHarvestAllUsers } from './shared';

const TARGET = process.env.TARGET || 'local'
const URL = TARGET === 'local' ? 'http://localhost:3000' : 'generate s3 url'
console.log(`Running e2e against ${TARGET}: ${URL}`)

let page: puppeteer.Page
let browser: puppeteer.Browser

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

describe("signing in as a spotify user", () => {
  test('with NO play history', async () => {
    const u = users.NoHistory
    await signIn(page, URL, u)
    await page.waitForSelector('[data-test="link-history"]')
    await page.click('[data-test="link-history"]')
    // verify that i see the "go listen to something"
    await page.waitForSelector('[data-test="alert-no-history"]')
    // should probably have a link to spotify and verify that its there
  }, 30000)

  test('WITH play history', async () => {
    const u = users.WithHistory
    await signIn(page, URL, u)
    await page.waitForSelector('[data-test="link-history"]')
    await page.click('[data-test="link-history"]')
    // verify that i see the timeline element
    await page.waitForSelector('[data-test="play-timeline"]')
    // there should be items that match my expected play history
    const items = await page.$$('[data-test="play-item"]')
    expect(items.length).toEqual(u.tracks.length)
    for (let idx = 0; idx < u.tracks.length; idx ++) {
      const item = items[idx]
      const foundName = await item.$eval('[data-test="track-name"]', el => el.textContent)
      expect(foundName).toEqual(u.tracks[idx].name)
    }
  }, 30000)
})
