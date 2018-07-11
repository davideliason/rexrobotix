const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const misc = require('./s3upload');

require('dotenv').config()

misc.s3upload();
