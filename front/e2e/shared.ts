import puppeteer from 'puppeteer'
import rp from 'request-promise'


export type TrackInfo = {
  name: string,
}

export type UserInfo = {
  email: string,
  description: string,
  password: string,
  displayName: string,
  tracks?: TrackInfo[],
}

export const globals = {
  topArtists: [
    {
      name: 'Mötley Crüe',
      hours: 1,
      minutes: 15,
    },
    {
      name: 'Warrant',
      hours: 0,
      minutes: 18,
    },
    {
      name: 'MC Frontalot',
      hours: 0,
      minutes: 14,
    },
    {
      name: 'Gorky Park',
      hours: 0,
      minutes: 10,
    },
    {
      name: 'Europe',
      hours: 0,
      minutes: 5,
    },
  ]
}

export const users = {
  NoHistory: {
    email: "steve@soundpruf.com",
    description: "no history",
    password: "Notagoodpassword1",
    displayName: "sp test account",
    tracks: [],
    topArtistsLife: [],
  },
  WithHistory: {
    email: "sdebaun@sofia4ventura.com",
    description: "some history",
    password: "Notagoodpassword2",
    displayName: "sp test with history",
    tracks: [
      {
        name: 'Gold Locks'
      },
      {
        name: 'Charisma Potion'
      },
      {
        name: 'Internet Sucks'
      },
      {
        name: 'I\'ll Form the Head'
      },
      {
        name: 'Levitating'
      },
    ],
    topArtistsLife: [
      {
        name: 'MC Frontalot',
        hours: 0,
        minutes: 14,
      },
      {
        name: 'Jean Grae',
        hours: 0,
        minutes: 3,
      },
      {
        name: 'invention_',
        hours: 0,
        minutes: 2,
      },
    ]
  },
  BigHistory: {
    email: "sdebaun@tripwestgames.com",
    description: "much history",
    password: "Notagoodpassword3",
    displayName: "sp test with lots of history",
    tracks: [
      {
        name: 'Rattlesnake Shake'
      },
      {
        name: 'Rattlesnake Shake'
      },
      {
        name: 'Use It Or Lose It'
      },
      {
        name: 'Hooligan\'s Holiday'
      },
    ],
    topArtistsLife: [
      {
        name: 'Mötley Crüe',
        hours: 1,
        minutes: 15,
      },
      {
        name: 'Warrant',
        hours: 0,
        minutes: 18,
      },
      {
        name: 'Gorky Park',
        hours: 0,
        minutes: 10,
      },
      {
        name: 'Europe',
        hours: 0,
        minutes: 5,
      },
      {
        name: 'Winger',
        hours: 0,
        minutes: 4,
      },
    ]
  }
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const signIn = async (page: puppeteer.Page, URL: string, userInfo: UserInfo) => {
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


export const triggerStartHarvestAllUsers = async () => {
  const uri = 'http://localhost:4000/startHarvestAllUsers'

  const response = await rp({
    method: 'POST',
    uri,
    body: {},
    json: true
  })
  await delay(3000)
  console.log('response', response)
}
