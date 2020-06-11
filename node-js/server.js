// load in environment variables 
if (process.env.NODE_ENV !== "production"){
	require("dotenv").config
}


// passport package can be used to have the login via facebook etx

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")

const initializePassport = require("./passport-config")
initializePassport(
	passport, 
	email => users.find(user => user.email === email))

// instead of saving in a database we store the info
// about the user in a local variable
// should connect to Database here later
const users = []



// setting view engine to ejs
app.set("view-engine", "ejs")
app.use(express.urlencoded({extended:false}))
app.use(flash())
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())


app.get('/', (req, res) => {
	res.render("index.ejs", {name: "Henny"})
})

app.get("/login", (req, res)=>{
	res.render("login.ejs")
})

app.get("/register", (req, res)=>{
	res.render("register.ejs")
	
})


app.post('/register', async (req, res) => {
	try {
	  const hashedPassword = await bcrypt.hash(req.body.password, 10)
	  users.push({
		id: Date.now().toString(),
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword
	  })
	  console.log(users)
	  res.redirect('/login')

	} catch {
	  res.redirect('/register')
	}
  })


app.listen(8000)