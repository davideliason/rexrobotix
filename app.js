// RUN PACKAGES

const express = require('express');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer({
	dest: "uploads/"
});

const storage = multer({
  dest: 'picture_storage'
});

var maxSize = 1 * 1000 * 1000;

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
    },

    limits: {
    	fileSize: maxSize
    }
  };

// SETUP APP
const app = express();
const port = process.env.PORT || 8080;

// middleware
app.use(logger('dev'))
app.use(bodyParser.json()) // JSON
app.use(bodyParser.urlencoded({ extended: false })) // body requests
// app.use(cookieParser())
   // .use(express.static(path.join(__dirname,'public')))
 app.use(session({
		secret: "asdfasd",
		resave: false,
		saveUninitiated: true,
		cookie: { maxAge: 180000}
	}))
app.use('/', express.static(path.join(__dirname, '/public'))); 


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

	// multer
app.post('/uptest', upload.single('photo'), function(req,res,next) {
	var data = req.file;
	console.log(typeof data);
	fs.writeFile('image.txt', data, (err) => {
		if(err) console.log(err);
	});
	res.end("You uploaded" + req.file.originalname);
	});


app.post('/upload',multer(multerConfig).single('photo'),function(req,res){
	res.send('Complete!');
	});

app.listen(port);




// app.listen(8080);