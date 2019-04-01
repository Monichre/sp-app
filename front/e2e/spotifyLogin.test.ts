import puppeteer from 'puppeteer'

const TARGET = process.env.TARGET || 'local'
const URL = TARGET === 'local' ? 'http://localhost:3000' : 'generate s3 url'
console.log(`Running e2e against ${TARGET}: ${URL}`)

let page: puppeteer.Page
let browser: puppeteer.Browser

beforeAll(async () => {
  browser = await puppeteer.launch()
  // use the below when you want to see the tests happen in an actual window
  // browser = await puppeteer.launch({
  //   headless: false,
  //   slowMo: 1,
  //   args: [`--window-size=800,640`]
  // })
  page = await browser.newPage()
})

afterAll(async () => {
  await browser.close()
})

const EMAIL = "steve@soundpruf.com"
const PASSWORD = "Notagoodpassword1"

describe("a thing", () => {
  test('a test', async () => {
    // sign in with spotify from home page
    await page.goto(URL)
    await page.waitForSelector('[data-test="spotifyLogin"]')
    await page.click('[data-test="spotifyLogin"]')
    // on spotify page fill out the form and click the button
    await page.waitForSelector('[name="username"]')
    await page.type('[name="username"]', EMAIL)
    await page.waitForSelector('[name="password"]')
    await page.type('[name="password"]', PASSWORD)
    await page.waitForSelector('#login-button')
    await page.click('#login-button')
    // back on our home page i should see my name
    await page.waitForSelector('[data-test="displayName"]')
    const displayName = await page.$eval('[data-test="displayName"]', el => el.textContent)
    expect(displayName).toEqual('sp test account')
  }, 30000)
})
