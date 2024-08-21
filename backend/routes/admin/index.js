var express = require('express');
var router = express.Router();
const authRouter = require("./auth");

router.use(authRouter);
module.exports = router;