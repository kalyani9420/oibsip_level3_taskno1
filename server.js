require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const connection = mongoose.connection
const app = express()
const ejs = require("ejs")
const path = require("path")
const cookieParser = require("cookie-parser");
const expressLayout = require("express-ejs-layouts")
// const MongoStore = require('connect-mongo').default;
// now app can use as a object which contain all functionality of express
const PORT = process.env.PORT || 3300;
const session = require("express-session")
const flash = require("express-flash")
// const MongoDbStore = require("connect-mongodb-session")(session);
const MongoDbStore = require("connect-mongo")(session)
const passport = require("passport")


mongoose.connect(
  "mongodb://127.0.0.1/pizza",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if(!err) console.log('Database connect...');
    else console.log('Database error');
  }
);

// database connection
// const url = 'mongodb://127.0.0.1/pizza';
// mongoose.connect(process.env.MONGO_CONNECTION_URL,{ useNewUrlParser: true , useCreateIndex: true , useUnifiedTopology: true, useFindAndModify: true });
// // const connection = mongoose.connection;
// connection.once('open' , () =>{
//     console.log('Database connected...');
// }).catch(err =>{
//     console.log('Connection failed...')
// });

// const url = 'mongodb://127.0.0.1/pizza';

//    mongoose.connect(url, {
//     useNewUrlParser: true
//     // useCreateIndex: true, useUnifiedTopology: true , useFindAndModify: true
// });


//sessions store
let mongoStore = new MongoDbStore({
  url: 'mongodb://127.0.0.1/pizza',
mongooseConection: connection,
collection: "sessions"
});

//session config
app.use(session({
  //secret is cooki id which should not declare in code directly declare it in .env file
  secret: process.env.COOKIE_SECRET,
  resave: false,
  store: mongoStore,
  saveUninitialized: false,
   cookie: { maxAge: 1000 * 60 * 60 * 24 },  //24 hours

})
);
app.use(cookieParser());
app.use(passport.initialize())

app.use(passport.session())
//passport config
const passportInit = require('./app/config/passport')
passportInit(passport)



app.use(flash());

//assets
app.use(express.static("public"))
app.use(express.urlencoded({ extended : false}))
app.use(express.json())

//global middleware
app.use((req, res , next)=>{
  res.locals.session = req.session
  res.locals.user = req.user

  next()

})

// set Template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"))
app.set("view engine", "ejs")
require("./routes/web")(app)

app.listen(PORT, () => {
  console.log(`listen on port ${PORT}`)
})
