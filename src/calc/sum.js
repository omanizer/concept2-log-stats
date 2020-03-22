const moment = require('moment-timezone')
const get = require('lodash/get')
const allData = require('../lib/allData')

const run = async ({ from = null, to = null, field = 'Work Distance' } = {}) => {
  let data = await allData()
  data = data.concat([])

  if (from) {
    data = data.filter(r => moment(r.Date).isAfter(from))
  }

  if (to) {
    data = data.filter(r => moment(r.Date).isBefore(to))
  }

  return data.reduce((total, record) => total * 1 + (get(record, field) || 0) * 1, 0)
}

module.exports = run
