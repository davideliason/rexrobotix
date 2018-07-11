const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const misc = require('./s3upload');
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

require('dotenv').config()
// misc.s3upload();
app.use(express.static(__dirname + "/../static_files"));
// routes
app.get('/', (req,res) => {
  res.end('hello world');
});

app.listen(port);
console.log(`server listening at ${port}`);
