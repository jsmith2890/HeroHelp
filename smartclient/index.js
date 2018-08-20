const fs = require('fs')
const path = require('path')
const HeroClient = require('./simulator/HeroClient')

// Reads a directory of json files and creates an array of objects:
// [{ name: <filename>, data: <json data>}, ...]
const loadFiles = dir => {
  console.log('LOADING FILES')
  const allInputFiles = []
  let totalHeroes = 0
  fs.readdirSync(path.join(__dirname, dir)).forEach(file => {
    const name = file.replace('.json', '')
    // console.log('require path:', './' + path.join(dir, file))
    const data = require('./' + path.join(dir, file))
    console.log('file:', file)
    totalHeroes += 1
    allInputFiles.push({name, data})
  })
  console.log('TOTAL HEROES:', totalHeroes)
  return allInputFiles
}

async function run() {
  const inputFiles = loadFiles('./data/heroes')

  const heroClient = new HeroClient(inputFiles[0].data)
  await heroClient.run()
  console.log('Finished running HeroClient')
  // Create a new hero client with each hero
  // inputFiles.forEach(inputFile => {
  //   console.log('file:', inputFile.name)
  // })
}

run()
