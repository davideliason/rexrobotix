// RUN PACKAGES

const express = require('express'),
	session = require('express-session'),
	path = require('path'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	multer = require('multer'),
	passport = require('passport'),
	flash = require('express-flash'),
	cookieParser = require('cookie-parser'),
	LocalStrategy = require('passport-local').Strategy,
	upload = multer({
		dest: "uploads/"
	});

var maxSize = 1 * 1000 * 1000;

const multerConfig = {

	storage: multer.diskStorage({
		//Setup where the user's file will go
		destination: function (req, file, next) {
			next(null, './public/photo-storage');
		},

		//Then give the file a unique name
		filename: function (req, file, next) {
			console.log(file);
			const ext = file.mimetype.split('/')[1];
			next(null, file.fieldname + '-' + Date.now() + '.' + ext);
		}
	}),

	//A means of ensuring only images are uploaded. 
	fileFilter: function (req, file, next) {
		if (!file) {
			next();
		}
		const image = file.mimetype.startsWith('image/');
		if (image) {
			console.log('photo uploaded');
			next(null, true);
		} else {
			console.log("file not supported");

			//TODO:  A better message response to user on failure.
			return next();
		}
	},

	limits: {
		fileSize: maxSize
	}
};

// SETUP APP
const port = process.env.PORT || 8080;

const app = express();
var session_configuration = {
	secret: "griffendorf",
	resave: false,
	saveUninitiated: true,
	cookie: { maxAge: 180000 }
};
// HTTPS is inconvenient for dev
session_configuration.cookie.secure = false;


// middleware
app.use(flash());
app.use(session(session_configuration));
app.use(cookieParser('hello there buddy'));
app.use(passport.initialize());
app.use(passport.session()); // persisten login sessions

app.use(logger('dev'))
app.use(bodyParser.json()) // JSON
app.use(bodyParser.urlencoded({ extended: false })) // body requests

var users = {
	"id123456": {
		id: 123456,
		username: "tom",
		password: "talker"
	},
	"id1": {
		id: 1,
		username: "bob",
		password: "sparkles"
	}
};

// configure strategy
passport.use(new LocalStrategy(
	function (username, password, done) {
		for (userid in users) {
			var user = users[userid];
			if (user.username.toLowerCase() == username.toLowerCase()) {
				// we have a match!
				if (user.password == password) {
					return done(null, user);
				}
			}
		}
		// if not match, then...
		return done(null, false, { message: "Wrong credentials" });
	}
));

// passport does not serialize the entire object, a vulnerability. 
// instead, it asks us what value it should use to store a user to session data.

passport.serializeUser(function (user, done) {
	if (users["id" + user.id]) {
		done(null, "id" + user.id);
	} else {
		done(new Error("CANT_SERIALIZE_INVALID_USER"));
	}
});

// when a new page is loaded, passport will pass the value it used to store a user to session data
// to following function, where we can pass back the full user object.
passport.deserializeUser(function (userid, done) {
	if (users[userid]) {
		done(null, users[userid]);
	} else {
		done(new Error("CANT_FIND_USER_TO_DESERIALIZE"));
	}
});
// remove so that server route provided link will be rendered
// app.use('/', express.static(path.join(__dirname, '/public')));

// simple use of cookie
app.get('/', function (req, res) {
	var sessData = req.session;
	sessData.last_access = new Date();
	var x = sessData.last_access;
	console.log("last logged" + x);
	// fs.writeFile('session.txt', x.toString(), (err) => {
	// 	if (err) console.log(err);
	// });
	// res.sendFile('index.html');
	console.log(req.flash());
	res.end('<a href="/login">Login</a>');
});

// return cookie value
app.get('/loggedin', function (req, res, next) {
	var loggedIn = req.session.last_access;
	res.send(`You had logged in at ${loggedIn}`);
});

// multer
app.post('/upload', multer(multerConfig).single('photo'), function (req, res) {
	res.send('Complete!');
});

app.listen(port);
