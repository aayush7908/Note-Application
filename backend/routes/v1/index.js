const router = require('express').Router();

router.use('/v1/', require('./welcome'));
router.use('/v1/auth', require('./auth'));
router.use('/v1/notes', require('./notes'));

module.exports = router;