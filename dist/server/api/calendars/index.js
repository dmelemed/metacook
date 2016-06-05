'use strict';

var express = require('express');
var controller = require('./calendars.controller');

var router = express.Router();

router.get('/', controller.index);
// router.delete('/:id', controller.destroy);
// router.get('/me', controller.me);
// router.put('/:id/password',  controller.changePassword);
// router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);
router.get('/colors', controller.colors);
module.exports = router;
