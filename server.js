require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connection = mongoose.connection;
const app = express();
const ejs = require("ejs");
const path = require("path");
const cookieParser = require("cookie-parser");
const expressLayout = require("express-ejs-layouts");
// const MongoStore = require('connect-mongo').default;
// now app can use as a object which contain all functionality of express
const PORT = process.env.PORT || 3300 || 3301;
const session = require("express-session");
const flash = require("express-flash");
// const MongoDbStore = require("connect-mongodb-session")(session);
const MongoDbStore = require("connect-mongo")(session);
const passport = require("passport");
const Emitter = require("events");

mongoose.connect(
  "mongodb://127.0.0.1/pizza",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) console.log("Database connect...");
    else console.log("Database error");
  }
);

//sessions store
let mongoStore = new MongoDbStore({
  url: "mongodb://127.0.0.1/pizza",
  mongooseConection: connection,
  collection: "sessions",
});

//event emitter
//once user get register on our applictaion then emmiter create event as user is register now if we want to send  welcome msg
//to user and if this functinality is in another part of application in that case we can use emitter in complete project we can listen emmiter
const eventEmitter = new Emitter();
//binding of Emitter with application
//instance name should be same
app.set("eventEmitter", eventEmitter);

//session config
app.use(
  session({
    //secret is cooki id which should not declare in code directly declare it in .env file
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, //24 hours
  })
);
app.use(cookieParser());
app.use(passport.initialize());

app.use(passport.session());
//passport config
const passportInit = require("./app/config/passport");
const { join } = require("path");
passportInit(passport);

app.use(flash());

//assets
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;

  next();
});

// set Template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");
require("./routes/web")(app);

const server = app.listen(PORT, () => {
  console.log(`listen on port ${PORT}`);
});

//socket

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  //socket generate its own id
  // console.log(socket.id)

  socket.on("join", (roomName) => {
    socket.join(roomName);
  });
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
  // console.log(data)
});

eventEmitter.on("orderPlaced", (data) => {
  io.to(`adminRoom`).emit("orderPlaced", data);
  // console.log(data)
});