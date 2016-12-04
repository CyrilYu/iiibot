import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

const connect = 'mariadb://root:1qaz2wsx@localhost:3306/iiibot'

// create db connection
const sequelize = new Sequelize(connect, { logging: true })

sequelize.authenticate().then(errors => {
  if (errors) {
    throw errors
  }
  console.log('Connect Success.')
})

let db = {}

_.each(fs.readdirSync('./models'), (file) => {
  if (file.indexOf('.') === 0 || file === 'index.js'|| file === 'init.sql') {
    return
  }
  const model = sequelize.import(path.join(__dirname, file))
  return db[model.name] = model
})

sequelize.sync().then(() => {
  console.log('Initial DB success')
})

module.exports = db
