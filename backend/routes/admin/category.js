

var express = require('express');
var router = express.Router();
const authBuilder = require('../../app/controllers/category');
const movie = require('../../app/controllers/movie');
const user = require('../../app/controllers/user');
const schedule = require('../../app/controllers/schedule');
const authMiddleware = require('./../../app/common/adminAuthjwt');

const isAuth = authMiddleware.roleGuards;

router.get('/category',isAuth, authBuilder.getAll);

router.get('/movie',isAuth, movie.getAll);
router.get('/movie/show/:id',isAuth, movie.show);
router.put('/movie/update/:id',isAuth, movie.update);
router.post('/movie/store',isAuth, movie.create);
router.delete('/movie/delete/:id',isAuth, movie.show);


router.get('/schedule',isAuth, schedule.getAll);
router.get('/schedule/show/:id',isAuth, schedule.show);
router.put('/schedule/update/:id',isAuth, schedule.update);
router.post('/schedule/store',isAuth, schedule.create);
router.delete('/schedule/delete/:id',isAuth, schedule.show);

router.get('/user',isAuth, user.getAll);
router.get('/user/show/:id',isAuth, user.show);
router.put('/user/update/:id',isAuth, user.update);
router.post('/user/store',isAuth, user.create);
module.exports = router;

