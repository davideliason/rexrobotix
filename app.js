var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express()

// middleware
   .use(logger('dev'))
   .use(bodyParser.json())
   .use(bodyParser.urlencoded({ extended: false }))
// app.use(cookieParser())
   // .use(express.static(path.join(__dirname,'public')))
   .use(session({
		secret: "asdfasd",
		resave: false,
		saveUninitiated: true,
		cookie: { maxAge: 180000}
	}))
   .use(function(req,res) {
   	req.session.last_access = new Date();
   	
   	var x = req.session.last_access;
   	res.end("you asked for this at" + x);
   })
   .listen(8080);



// routes
// app.get('/', (req,res) => {
// 	res.sendFile('/index.html');
// });

// app.use(session({ secret: 'this-is-a-secret-toke', cookie: { maxAge: 60000 }}));
 
// Access the session as req.session
// app.get('/', function(req, res, next) {
//   var sessData = req.session;
//   sessData.someAttribute = "foo";
//   res.send('Returning with some text');
// });


// app.get('/bar', function(req, res, next) {
//   var someAttribute = req.session.someAttribute;
//   res.send(`This will print the attribute I set earlier: ${someAttribute}`);
// });

// app.listen(8080);