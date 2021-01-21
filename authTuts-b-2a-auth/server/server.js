//npm modules
const express = require('express')
const uuid = require('uuid').v4
const session = require('express-session')
const FileStore = require('session-file-store')(session)  // <--- added

// create the server
const app = express()

// add & configure middlware
app.use(
  session({
    genid: req => {
      console.log('[mw session] req.sessionID:', req.sessionID)
      return uuid() // use UUIDs for session IDs
    },
    store: new FileStore(),   // <----- added
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


// create the login get and post routes
app.get('/login', (req, res) => {
  console.log('[R:GET /login] req.sessionId: ', req.sessionID)
  res.send('[R:GET /login] You got the login page!\n')
})
app.post('/login', (req, res) => {
  console.log('[R:POST /login] req.sessionId: ', req.sessionID)
  console.log('[R:POST /login] req.body: ', req.body)        // undefined
  res.send(`[R:POST /login] You posted to the login page!\n`)
})



// tell the server what port to listen on
app.listen(3000, () => {
  console.log('Listening on localhost:3000')
})
