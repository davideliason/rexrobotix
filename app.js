var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var upload = multer({
	dest: "uploads/"
});

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
	}));

   // Sessions
   app.get('/',function(req,res) {
   	var sessData = req.session;
   	sessData.last_access = new Date();
   	var x = sessData.last_access;
   	console.log("last logged" + x);
   	fs.writeFile('session.txt',x.toString(), (err) => {
   		if(err) console.log(err);
   	});
   	res.send(`you logged on ${x}`);
   });

   app.get('/loggedin', function(req,res,next) {
   	var loggedIn = req.session.last_access;
   	res.send(`You had logged in at ${loggedIn}`);
   });

   // multer
   app.post('/uptest', upload.single('photo'), function(req,res,next) {
   	var data = req.file;
   	console.log(typeof data);
   	fs.writeFile('image.txt', data, (err) => {
   		if(err) console.log(err);
   	});
   	res.end("You uploaded" + req.file.originalname);
   });

   app.listen(8080);




// app.listen(8080);