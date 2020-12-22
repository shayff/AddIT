const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys')

const User = mongoose.model('users');

//handle cookie data
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
    });
});

//handle google login
passport.use(
    new GoogleStrategy({
        clientID: keys.GoogleClientID,
        clientSecret: keys.GoogleClientSecret,
        callbackURL: '/auth/google/callback'
        },
        (accessToken, refreshToken, profile, done) => {
            //if user not exist we create a new record
            User.findOne({ googleId: profile.id })
                .then(existingUser => {
                    if (existingUser) {
                        // user already sign up
                        done(null, existingUser);
                    }
                    else {
                        new User({ googleId: profile.id })
                            .save()
                            .then(newUser => done(null, newUser));                        
                    }

            })
        }
    )
);