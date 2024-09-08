

var express = require('express');
var router = express.Router();
const authBuilder = require('../../app/controllers/category');
const movie = require('../../app/controllers/movie');
const user = require('../../app/controllers/user');
const schedule = require('../../app/controllers/schedule');
const hall = require('../../app/controllers/room');
const booking = require('../../app/controllers/booking');
const dashboard = require('../../app/controllers/dashboard');
const authMiddleware = require('./../../app/common/adminAuthjwt');

const isAuth = authMiddleware.roleGuards;

router.get('/category',isAuth, authBuilder.getAll);
router.post('/category/delete',isAuth, authBuilder.deleteById);
router.put('/category/update/:id',isAuth, authBuilder.update);

router.get('/statistic',isAuth, dashboard.getAll);

router.get('/movie',isAuth, movie.getAll);
router.get('/movie/show/:id',isAuth, movie.show);
router.put('/movie/update/:id',isAuth, movie.update);
router.post('/movie/store',isAuth, movie.create);
router.delete('/movie/delete/:id',isAuth, movie.deleteById);
router.get('/movie/migrate', movie.alterAddColIsDelete);


router.get('/schedule',isAuth, schedule.getAll);
router.get('/schedule/show/:id',isAuth, schedule.show);
router.put('/schedule/update/:id',isAuth, schedule.update);
router.post('/schedule/store',isAuth, schedule.create);
router.delete('/schedule/delete/:id',isAuth, schedule.deleteById);


router.get('/hall',isAuth, hall.getAll);
router.get('/hall/show/:id',isAuth, hall.show);
router.put('/hall/update/:id',isAuth, hall.update);
router.post('/hall/store',isAuth, hall.create);
router.delete('/hall/delete/:id',isAuth, hall.deleteById);


router.get('/theatre',isAuth, hall.getAllTheatre);
router.get('/theatre/show/:id',isAuth, hall.show);
router.put('/theatre/update/:id',isAuth, hall.update);
router.post('/theatre/store',isAuth, hall.create);
router.delete('/theatre/delete/:id',isAuth, hall.show);

router.get('/order',isAuth, booking.getAll);
router.get('/order/show/:id',isAuth, booking.show);
router.put('/order/update/:id',isAuth, booking.update);
router.post('/order/store',isAuth, booking.create);
router.delete('/order/delete/:id',isAuth, booking.deleteById);

router.get('/user',isAuth, user.getAll);
router.get('/user/show/:id',isAuth, user.show);
router.put('/user/update/:id',isAuth, user.update);
router.post('/user/store',isAuth, user.create);
router.delete('/user/delete/:id',isAuth, user.deleteById);
module.exports = router;

