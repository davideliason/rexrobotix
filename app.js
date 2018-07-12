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

const storage = multer.diskStorage({
  destination: 'picture_storage',
  filename: function (req, file, callback) {
	   crypto.pseudoRandomBytes(16, function(err, raw) {
	  if (err) return callback(err);

  		callback(null, raw.toString('hex') + path.extname(file.originalname));
});
  }
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

   app.post('/uptest', upload.single('photo'), function(req,res,next) {
   	var data = req.file;
   	console.log(typeof data);
   	fs.writeFile('image.txt', data, (err) => {
   		if(err) console.log(err);
   	});
   	res.end("You uploaded" + req.file.originalname);
   });

   app.listen(8080);



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