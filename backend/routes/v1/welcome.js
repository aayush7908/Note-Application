const router = require('express').Router();

router.get('/', (req, res) => {
    return res.send("server running ...");
});

module.exports = router;