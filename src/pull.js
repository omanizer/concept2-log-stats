const retrieveData = require('./lib/retrieveData')

retrieveData().then((result) => console.log('pulled', result.length, 'files'))