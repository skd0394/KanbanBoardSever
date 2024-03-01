require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./db");
const port = process.env.PORT;
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const User = require("./Model/UserSchema");
const Board = require("./Model/BoardSchema");

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

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            recentlyVisitedBoard: [],
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL + "/dashboard",
    failureRedirect: process.env.CLIENT_URL + "login",
  })
);

app.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({ message: "user Login", user: req.user });
  } else {
    res.status(200).json({ message: "fail to login" });
  }
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(process.env.CLIENT_URL);
  });
});

app.post("/user/new-blog", async (req, res) => {
  console.log(req);
  try {
    let newBoard = new Board({
      name: req.body.name,
      createdBy: req.user._id,
      members: [],
    });
    await newBoard.save();
    let result = await User.findById({ _id: req.user._id });
    if (result) {
      result.recentlyVisitedBoard = req.body.recentlyVisitedBoard;
      await result.save();
    }
    res.status(200).json({ message: "Board created successfully" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

app.get("/blogs", async (req, res) => {
  console.log(req);

  try {
    if (req.user._id) {
      let boards = await Board.find({})
        .sort({ timestamp: -1 })
        .limit(3).populate("createdBy");
      if (boards) {
        res.status(200).json({ message: "Recently used boards", boards });
      } else {
        res.status(301).json({ message: "boards not found" });
      }
    } else {
      res.status(401).json({ message: "Please login first" });
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
