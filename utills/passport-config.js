const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { user } = require("../models/userModel");

/** Authenticate User With Passport.Js */

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const existingUser = await user.findOne({ where: { email: email } });

        if (!existingUser) {
          return done(null, false, { message: "Incorrect email." });
        }

        const passwordMatch = await bcrypt.compare(
          password,
          existingUser.password
        );

        if (passwordMatch) {
          return done(null, existingUser);
        } else {
          return done(null, false, { message: "Incorrect password." });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const existingUser = await user.findByPk(id);
    done(null, existingUser);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
