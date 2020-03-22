const fs = require('fs')
const path = require('path')
const flatten = require('lodash/flatten')
const csvtojson = require('csvtojson')

const dataPath = path.join(__dirname, '../../data')

const readAllData = async () => {
  let files = await new Promise((resolve, reject) => {
    fs.readdir(dataPath, (err, files) => {
      if (err) {
        return reject(err)
      }
      resolve(files)
    })
  })

  let dataBySeason = await Promise.all(files.map(async (file) => {
    let filePath = path.join(dataPath, file)
    let json = await csvtojson({flatKeys: true}).fromFile(filePath)
    return json
  }))

  return flatten(dataBySeason)
}

module.exports = readAllData
