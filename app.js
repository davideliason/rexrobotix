var express = require('express');
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var crypto = require('crypto');
var upload = multer({
	dest: "uploads/"
});

const storage = multer({
  dest: 'picture_storage'
});

const multerConfig = {
    
storage: multer.diskStorage({
 //Setup where the user's file will go
 destination: function(req, file, next){
   next(null, './public/photo-storage');
   },   
    
    //Then give the file a unique name
    filename: function(req, file, next){
        console.log(file);
        const ext = file.mimetype.split('/')[1];
        next(null, file.fieldname + '-' + Date.now() + '.'+ext);
      }
    }),   
    
    //A means of ensuring only images are uploaded. 
    fileFilter: function(req, file, next){
          if(!file){
            next();
          }
        const image = file.mimetype.startsWith('image/');
        if(image){
          console.log('photo uploaded');
          next(null, true);
        }else{
          console.log("file not supported");
          
          //TODO:  A better message response to user on failure.
          return next();
        }
    }
  };

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
   .use(express.static('public'));


   app.get('/',function(req,res) {
   	var sessData = req.session;
   	sessData.last_access = new Date();
   	var x = sessData.last_access;
   	console.log("last logged" + x);
   	fs.writeFile('session.txt',x.toString(), (err) => {
   		if(err) console.log(err);
   	});
   	res.sendFile('index.html');
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

   app.post('/', storage.single('avatar'), (req, res) => {
  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false
    });

  } else {
    console.log('file received');
    // res.send({
    //   success: true,
    // });
    res.end("You uploaded " + req.file.originalname + "with mime type: " + req.file.mimetype + " of this size: " + req.file.size + " at req.file.destination")
  }
});

   app.post('/upload',multer(multerConfig).single('photo'),function(req,res){
   res.send('Complete!');
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