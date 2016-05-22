'use strict';

var express = require('express');
var controller = require('./ogImage.controller');

var router = express.Router();

router.post('/', controller.findOgMetadata);

module.exports = router;