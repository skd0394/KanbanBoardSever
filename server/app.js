require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db");
const port = process.env.PORT;
const session = require("express-session");
const passport = require("passport");
const router = require("./Routes/index");

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
  })
);

app.use(express.json());

//session setup

app.use(
  session({
    secret: "kanban1234",
    resave: false,
    saveUninitialized: true,
  })
);
   
app.use(passport.initialize());
app.use(passport.session());

require('./passport')

app.use(router)

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
