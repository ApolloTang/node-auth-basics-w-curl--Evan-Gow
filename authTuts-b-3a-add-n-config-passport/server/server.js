//npm modules
const express = require('express')
const uuid = require('uuid').v4
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const bodyParser = require('body-parser')


// passport
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const users = [
  {id: '2f24vvg', email: 'test@test.com', password: 'password'}
]

// configure passport.js to use the local strategy
passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) => {
      console.log('== 2 ==')

      // here is where you make a call to the database
      // to find the user based on their username or email address
      // for now, we'll just pretend we found that it was users[0]
      const user = users[0]

      if(email === user.email && password === user.password) {
        console.log('== 3a ==')
        console.log('[passport local startegy] found user in db')
        return done(null, user) // <--- when done is called login() method is added to request object
      } else {
        console.log('== 3b ==')
        console.log('[passport local startegy] bad email/password combination')
      }
    }
  )
)

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  console.log('== B ==')
  console.log('[pp.serializerUser] user: ', user)
  const userID = user.id
  console.log('[pp.serializerUser] user id has been plugged out of user: ', userID)
  console.log('[pp.serializerUser] User id is save to the session file store here')
  done(null, userID);
})



// create the server
const app = express()

// add & configure middlware
app.use((req, res, next) => {
  console.log('-----------------', Date.now())
  next()
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(
  session({
    genid: req => {
      console.log('[mw session] req.sessionID:', req.sessionID)
      const newSessionID = uuid()
      console.log('[mw session] no sessionID generate one now: ', newSessionID )
      return newSessionID
    },
    store: new FileStore(),
    secret: 'some-randomly-generated-string-from-dot-env-file-111',
    resave: false,
    saveUninitialized: true
  })
)

app.use(passport.initialize());
app.use(passport.session());


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
app.post('/login', (req, res, next) => {
  console.log('[R:POST /login] req.sessionId: ', req.sessionID)
  console.log('[R:POST /login] req.body: ', req.body)

  console.log('== 1 ==')
  passport.authenticate(  // <--- this will invoke passport.use()
    'local',
    (err, user, info) => {
      console.log('== A ==')
      console.log('At this point passport has NOT been added to session')
      console.log('At this point user has NOT been added to request object')

      console.log('[R:POST /login pp.authenticate()] req.session.passport:', JSON.stringify(req.session.passport)) // <-- undefined
      console.log('[R:POST /login pp.authenticate()] req.user', JSON.stringify(req.user))   // <-- undefined

      if ('login' in req) {
        console.log('login method exist in req object') // login() method is added to req obj if user is found in database
      } else {
        console.log('login method DOSE NOT exist in req object')
      }

      req.login(user, (err) => {
        console.log('== C ==')
        console.log('At this point passport has been added to session')
        console.log('At this point user has been added to request object')

        console.log('[R:POST /login pp.login()] req.session.passport:', JSON.stringify(req.session.passport)) // <-- undefined
        console.log('[R:POST /login pp.login()] req.user', JSON.stringify(req.user))   // <-- undefined
        return res.send('[R:POST /login passport.login()] You were authenticated & logged in!\n');
      })
    }
  )(req, res, next);
})



// tell the server what port to listen on
app.listen(3000, () => {
  console.log('Listening on localhost:3000')
})
