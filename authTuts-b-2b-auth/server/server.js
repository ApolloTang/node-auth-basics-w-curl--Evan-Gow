//npm modules
const express = require('express')
const uuid = require('uuid').v4
const session = require('express-session')
const FileStore = require('session-file-store')(session)  
const bodyParser = require('body-parser')  // <--- added

// create the server
const app = express()

// add & configure middlware
app.use(bodyParser.urlencoded({ extended: false }))   // <--- added
app.use(bodyParser.json())                            // <--- added

app.use(
  session({
    genid: req => {
      console.log('Inside the session middleware')
      console.log(req.sessionID)
      return uuid() // use UUIDs for session IDs
    },
    store: new FileStore(),
    secret: 'some-randomly-generated-string-from-dot-env-file-111',
    resave: false,
    saveUninitialized: true
  })
)


// create the homepage route at '/'
app.get('/', (req, res) => {
  console.log('Inside the homepage callback function')
  console.log(req.sessionID)
  res.send(`Hit home page\n`)
})


// create the login get and post routes
app.get('/login', (req, res) => {
  console.log('Inside GET /login callback function')
  console.log(req.sessionID)
  res.send(`You got the login page!\n`)
})
app.post('/login', (req, res) => {
  console.log('Inside POST /login callback function')
  console.log(req.body)        // { email: 'test@test.com', password: 'password' }
  res.send(`You posted to the login page!\n`)
})



// tell the server what port to listen on
app.listen(3000, () => {
  console.log('Listening on localhost:3000')
})
