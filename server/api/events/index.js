'use strict';

var express = require('express');
var controller = require('./events.controller');

var router = express.Router({mergeParams: true});

router.get('/', controller.index);
// router.delete('/:id', controller.destroy);
// router.get('/me', controller.me);
// router.put('/:id/password',  controller.changePassword);
// router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;
