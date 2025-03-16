const { Router } = require('express');

const welcome = require('./welcome');
const auth = require('./auth');
const user = require('./user');
const note = require('./note');
const admin = require('./admin');


const router = Router();

router.use('/', welcome);
router.use('/auth', auth);
router.use('/user', user);
router.use('/note', note);
router.use('/admin', admin);

module.exports = router;