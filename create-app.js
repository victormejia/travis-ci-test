const express = require('express')
const bodyParser = require('body-parser')

module.exports = function createApp(db) {

  const app = express()

  app.use(bodyParser.json())

  app.get('/', (req, res) => {
    res.send('hello world')
  })

  app.post('/users', (req, res) => {
    db.collection('users').insert(req.body, (err, result) => {
      if (err) process.exit(err)
      res.status(201).json(result.ops[0])
    })
  })

  return app
}