const counter = require('./index')
const fs = require('fs')
const fse = require('fs-extra')
const walk = require('fswalk')

var count = counter(1000), size = 0
count.on('progress', () => {
  console.log(`${size} bytes so far (${count.at}/${count.total})`)
})
count.todo()
walk(process.env.HOME + "/Code", (path, stats) => {
  count.todo()
  fs.stat(path, (err, stat) => {
    if (stat) {
      size += stat.size
    }
    count.done()
  })
}, err => {
  if (err)
    console.log(err)
  count.done()
})
count.start(() => {
  console.log(`Total HOME directory size is: ${size} bytes`)

  // Now with promises + 1 async
  count = counter(1000)
  size = 0
  count.on('progress', () => {
    console.log(`${size} bytes so far (${count.at}/${count.total})`)
  })
  count.todo()
  walk(process.env.HOME + "/Code", (path, stats) => {
    count.todo(fse.stat(path).then(stat => {
      size += stat.size
    }))
  }, err => {
    if (err)
      console.log(err)
    count.done()
  })
  count.start(() => {
    console.log(`Total HOME directory size is: ${size} bytes`)
  })
})
