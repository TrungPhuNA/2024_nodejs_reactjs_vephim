var express = require('express');
var router = express.Router();
const authRouter = require("./auth");
const category = require("./category");

router.use(authRouter);
router.use(category);
module.exports = router;