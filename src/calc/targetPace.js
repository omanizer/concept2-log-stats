const moment = require('moment-timezone')
const max = require('lodash/max')
const min = require('lodash/min')

const run = ({ from, to, goal, current = 0, currentTime = moment() } = {}) => {
  if (!from || !to || !goal) {
    throw new Error('In order to calculate target pace, from, to, and goal are required')
  }

  from = moment(from).unix()
  to = moment(to).unix()
  let range = [from, to]
  from = min(range)
  to = max(range)

  // Normalize all values
  currentTime = moment(currentTime).unix() - from
  to = to - from
  from = 0

  if (currentTime > to) {
    currentTime = to
  }

  let result = {
    goal,
    should_be_at: Math.ceil(goal * (currentTime / to)),
    current: current
  }

  if (result.current) {
    if (result.current < result.should_be_at) {
      result.behind = result.should_be_at - result.current
      let behindSeconds = currentTime - (current / goal) * to
      result.behind_days = Math.ceil(behindSeconds / (24 * 3600))
    }
  }
  
  return result
}

module.exports = run
