const router = require('express').Router();

router.use('/v2/', require('./welcome'));
router.use('/v2/auth', require('./auth'));
router.use('/v2/user', require('./user'));
router.use('/v2/note', require('./note'));
router.use('/v2/admin', require('./admin'));

module.exports = router;