const puppeteer = require('puppeteer')
const axios = require('axios')
const csvtojson = require('csvtojson')
const moment = require('moment-timezone')
const range = require('lodash/range')
const flatten = require('lodash/flatten')
const fs = require('fs')
const path = require('path')

const authenticate = async (browser) => {
  const page = await browser.newPage()
  await page.goto('https://log.concept2.com/login')

  // Fill out username/password

  const username = process.env.C2_USERNAME
  const password = process.env.C2_PASSWORD

  if (!username || !password) {
    throw new Error('C2_USERNAME and C2_PASSWORD env vars are required')
  }

  await page.type('#username', username)
  await page.type('#password', password)
  await page.click('form input[type=submit]')

  return page
}

const run = async () => {
  await new Promise((resolve, reject) => {
    fs.mkdir(path.join(__dirname, '../../data'), { recursive: true }, (err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH,
    args: ['--no-sandbox']
  })

  const page = await authenticate(browser)
  const cookies = await page.cookies()
  let cookieHeader = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ')

  await browser.close()

  let currentYear = moment().year()

  let pulledFiles = await Promise.all(
    range(currentYear - 5, currentYear + 1).map(async (year) => {
      let response = await axios({
        method: 'GET',
        url: `https://log.concept2.com/season/${year}/export`,
        headers: {
          cookie: cookieHeader
        }
      })

      // If the CSV has at least one line in it write it to the year's file
      if (response.data && response.data.split('\n').filter(l => !!(l.trim())).length > 1) {
        await new Promise((resolve, reject) => {
          fs.writeFile(path.join(__dirname, `../../data/${year}.csv`), response.data, (err) => {
            if (err) {
              return reject(err)
            }
            resolve()
          })
        })

        return response.data
      }
    })
  )

  return pulledFiles.filter(f => !!f)
}

module.exports = run
