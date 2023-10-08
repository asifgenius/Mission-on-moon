const express = require('express');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const ejs = require('ejs');

const app = express();

passport.use(new GitHubStrategy({
    clientID: 'YOUR_GITHUB_CLIENT_ID',
    clientSecret: 'YOUR_GITHUB_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    // You can handle the user data here, for example, save it to a database.
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    // Serialize user data to the session
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    // Deserialize user data from the session
    done(null, obj);
});

app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs'); // Set EJS as the template engine

app.get('/', (req, res) => {
    res.render('index'); // Render the index.ejs file
});

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/profile');
    });

app.get('/profile', (req, res) => {
    // Access user data from req.user
    res.render('profile', { user: req.user });
    console.log(req.user);
});

// app.get('/logout', (req, res) => {
//     req.logout();
//     res.redirect('/');
// });

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});