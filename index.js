const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

require('dotenv').config()

//configuring the AWS environment
AWS.config.update({
    region: 'us-west-2',
    accessKeyId: process.env.AWS_ACCESSKEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
  });

var s3 = new AWS.S3();
var file = "index.html";

//configuring parameters
var params = {
  Bucket: 'rexrobotix.com',
  Body : fs.createReadStream(file),
  Key : path.basename(file),
  ContentType:'text/html'
};

s3.upload(params, function (err, data) {
  //handle error
  if (err) {
    console.log("Error", err);
  }

  //success
  if (data) {
    console.log("Uploaded in:", data.Location);
  }
});