const sum = require('./sum')
const targetPace = require('./targetPace')
const moment = require('moment-timezone')
const round = require('lodash/round')
const toNumber = require('lodash/toNumber')

const run = async () => {
  let from = moment().startOf('year')
  if (process.env.GOAL_FROM_TIME) {
    from = moment(process.env.GOAL_FROM_TIME)
  }
  let to = from.clone().add(1, 'year')
  if (process.env.GOAL_TO_TIME) {
    to = moment(process.env.GOAL_TO_TIME)
  }
  let distance = await sum({
    from,
    to,
    field: 'Work Distance'
  })
  let calories = await sum({
    from,
    to,
    field: 'Total Cal'
  })
  let strokes = await sum({
    from,
    to,
    field: 'Stroke Count'
  })

  return {
    distance: targetPace({ from, to, goal: toNumber(process.env.GOAL_DISTANCE || 1000000), current: distance }),
    calories,
    strokes: {
      current: strokes,
      m_per_stroke: round(distance / strokes, 1)
    }
  }
}

module.exports = run
