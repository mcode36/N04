"use strict";
/* 
Project Page: https://glitch.com/~global-nebulous-verbena
Live App: https://global-nebulous-verbena.glitch.me
Stage: Advanced Node and Express - Set up the Environment
*/

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const fccTesting = require("./freeCodeCamp/fcctesting.js");
const auth = require("./app/auth.js");
const routes = require("./app/routes.js");
const mongo = require("mongodb").MongoClient;
const passport = require("passport");
const cookieParser = require("cookie-parser");
const sessionStore = new session.MemoryStore();

const app = express();
const cors = require("cors");
app.use(cors());
const http = require("http").Server(app);
const io = require("socket.io")(http);

fccTesting(app); //For FCC testing purposes

app.use("/public", express.static(process.cwd() + "/public"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "pug");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    key: "express.sid",
    store: sessionStore
  })
);

mongo.connect(process.env.DATABASE, (err, client) => {
  if (err) console.log("Database error: " + err);
  console.log("Successful database connection");

  // define database name. This line is required, or mongo will use default satabase name, which is 'admin'
  const db = client.db("userAuth");

  auth(app, db);
  routes(app, db);

  http.listen(process.env.PORT || 3000);

  //start socket.io code
  io.on("connection", socket => {
    console.log("A user has connected 123");
  });

  //end socket.io code
});
