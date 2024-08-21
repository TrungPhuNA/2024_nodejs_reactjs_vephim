

var express = require('express');
var router = express.Router();
const authBuilder = require('../../app/controllers/auth');

router.route('/login').post(authBuilder.login);
module.exports = router;

