

var express = require('express');
var router = express.Router();
const authBuilder = require('../../app/controllers/category');
const movie = require('../../app/controllers/movie');
const user = require('../../app/controllers/user');
const authMiddleware = require('./../../app/common/adminAuthjwt');

const isAuth = authMiddleware.roleGuards;
router.get('/category',isAuth, authBuilder.getAll);

router.get('/movie',isAuth, movie.getAll);
router.get('/movie/show/:id',isAuth, movie.show);
router.put('/movie/update/:id',isAuth, movie.update);
router.post('/movie/store',isAuth, movie.create);
router.delete('/movie/delete/:id',isAuth, movie.show);

router.get('/user',isAuth, user.getAll);
router.get('/user/show/:id',isAuth, user.show);
router.put('/user/update/:id',isAuth, user.update);
router.post('/user/store',isAuth, user.create);
module.exports = router;

