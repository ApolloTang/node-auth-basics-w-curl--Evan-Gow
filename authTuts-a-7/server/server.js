//npm modules
const express = require('express')
const uuid = require('uuid').v4
const session = require('express-session')

// create the server
const app = express()

// add & configure middlware
app.use(
  session({
    genid: req => {
      console.log('[mw session] req.sessionID:', req.sessionID)
      const newSessionID = uuid()
      console.log('[mw session] no sessionID generate one now: ', newSessionID )
      return newSessionID
    },
    secret: 'some-randomly-generated-string-from-dot-env-file-111',
    resave: false,
    saveUninitialized: true
  })
)

// create the homepage route at '/'
app.get('/', (req, res) => {
  console.log('[route /] req.sessionID: ', req.sessionID)
  res.send('[route /] Hit home page\n')
})

// tell the server what port to listen on
app.listen(3000, () => {
  console.log('Listening on localhost:3000')
})
