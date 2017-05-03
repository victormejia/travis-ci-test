/* global before, after, describe, it */
const expect = require('chai').expect
const request = require('request')
const MongoClient = require('mongodb').MongoClient
const createApp = require('../create-app')

const DEFAULT_MONGO_URI = 'mongodb://localhost:27017/mongodb-express-travis-heroku'
const PORT = process.env.PORT || 3000
const host = 'http://localhost:' + PORT

describe('createApp', () => {

  let db, server

  before(done => {
    MongoClient.connect(DEFAULT_MONGO_URI, (err, _db) => {
      if (err) return done(err)
      db = _db
      const app = createApp(db)
      server = app.listen(PORT, () => done())
    })
  })

  after(done => {
    server.close()
    db.close(true, () => done())
  })

  describe('GET /', () => {
    it('says hello world!', done => {
      request.get(host, (err, res, body) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 200)
        expect(body).to.equal('hello world')
        done()
      })
    })
  })

  describe('POST /users', () => {
    it('creates a user', done => {
      request.post(host + '/users', { json: { username: 'Foo' } }, (err, res, body) => {
        expect(err).to.be.null
        expect(res).to.have.property('statusCode', 201)
        expect(body).to.have.property('username', 'Foo')
        done()
      })
    })
  })

})