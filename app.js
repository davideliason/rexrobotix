var express = require('express');
var session = require('express-session');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 60000 }}));
// middleware
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(cookieParser())
app.use(express.static(path.join(__dirname,'public')))



// routes
// app.get('/', (req,res) => {
// 	res.sendFile('/index.html');
// });
app.get('/', function(req, res, next) {
  var sessData = req.session;
  sessData.someAttribute = "foo";
  res.send('Returning with some text');
});

app.get('/bar', function(req, res, next) {
  var someAttribute = req.session.someAttribute;
  res.send(`This will print the attribute I set earlier: ${someAttribute}`);
});

app.listen(8080);