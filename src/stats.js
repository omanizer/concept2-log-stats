const basicStats = require('./calc/basicStats')

basicStats().then(r => console.log(JSON.stringify(r, null, 2)))
